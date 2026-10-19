import { useLocale, readLocale } from './locale-store';
import { AnimatedHubLogo } from './binary-motion';
import { AuthError, AuthErrorCode, authErrorCode } from './auth-errors';
import React, { useState, useEffect } from 'react';
import { Icon } from './icons';
import { content, languages } from './i18n';
import {
  currentAccount,
  signOut,
  loginStudent,
  registerStudent,
  loginProfessor,
  type Account,
} from './accounts';
import Hub from './hub';
import CampusLife from './campus';
import { usePathname, useRouter } from './navigation';
export default function AccountPortal() {
  const path = usePathname(),
    router = useRouter();
  const [account, setAccount] = useState<Account | null>(currentAccount);
  const [lang, setLang] = useLocale();
  const [role, setRole] = useState<'student' | 'club_leader' | 'professor'>('student'),
    [register, setRegister] = useState(false),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [reveal, setReveal] = useState(false);
  const c = (fr: string, en: string, zh?: string) => content(lang, fr, en, zh);
  useEffect(() => {
    const refresh = () => setAccount(currentAccount());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  const errors: Record<string, string> = {
    leader: c(
      'Ce compte n’a pas été nommé responsable de club. Demandez à un professeur de l’affecter à un club.',
      'This account has not been assigned as a club leader. Ask a professor to assign it to a club.',
      '该账户尚未被任命为社团负责人，请联系教师进行分配。',
    ),
    required: c(
      'Veuillez remplir tous les champs obligatoires.',
      'Complete all required fields.',
      '请填写所有必填项。',
    ),
    email: c(
      'Saisissez une adresse email valide.',
      'Enter a valid email address.',
      '请输入有效的电子邮箱。',
    ),
    phone: c(
      'Vérifiez le numéro de téléphone et son indicatif.',
      'Check the phone number and country code.',
      '请核对电话号码和国家区号。',
    ),
    grade: c('Choisissez votre niveau d’études.', 'Select your study level.', '请选择学习层次。'),
    password: c(
      'Le mot de passe doit comporter au moins 8 caractères.',
      'Use at least 8 characters for your password.',
      '密码至少需要8个字符。',
    ),
    duplicate: c(
      'Cet email ou ce matricule possède déjà un compte sur cet appareil.',
      'This email or student ID already has an account on this device.',
      '此邮箱或学号已在本设备注册。',
    ),
    credentials: c(
      'Email, matricule ou mot de passe incorrect.',
      'Incorrect email, student ID or password.',
      '邮箱、学号或密码不正确。',
    ),
    code: c(
      'Le code d’accès professeur est incorrect.',
      'The professor access code is incorrect.',
      '教师访问码不正确。',
    ),
    confirm: c(
      'Les mots de passe ne correspondent pas.',
      'The passwords do not match.',
      '两次输入的密码不一致。',
    ),
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      let a: Account;
      if (role === 'professor') a = loginProfessor(d.displayName, d.email, d.code);
      else if (register && role === 'student') {
        if (d.password !== d.confirm) throw new AuthError(AuthErrorCode.Confirmation);
        a = await registerStudent(
          {
            displayName: d.displayName.trim(),
            studentId: d.studentId,
            nationality: d.nationality.trim(),
            major: d.major.trim(),
            grade: d.grade,
            phone: d.phone.trim(),
            email: d.email,
          },
          d.password,
        );
      } else
        a = await loginStudent(
          d.identifier,
          d.password,
          role === 'club_leader' ? 'club_leader' : 'student',
        );
      setAccount(a);
      window.dispatchEvent(new Event('xidian-auth'));
      const intent = sessionStorage.getItem('xidian-club-intent');
      sessionStorage.removeItem('xidian-club-intent');
      window.location.hash = intent
        ? '#/campus?enroll=' + encodeURIComponent(intent)
        : a.role === 'applicant'
          ? '#/applications'
          : a.role === 'club_leader'
            ? '#/club-office'
            : '#/workspace';
    } catch (e) {
      setError(authErrorCode(e));
    } finally {
      setBusy(false);
    }
  }
  function logout() {
    signOut();
    setAccount(null);
    setError('');
    setRegister(false);
    setReveal(false);
    setLang(readLocale());
    window.location.hash = '#/';
  }
  if (account)
    return (
      <Hub key={account.id} account={account} onSignOut={logout} onAccountChange={setAccount} />
    );
  if (path === '/clubs')
    return (
      <div className="public-clubs">
        <header className="account-header">
          <a className="brand" href="#/">
            <AnimatedHubLogo />
          </a>
          <div className="row">
            <label className="language-picker">
              <Icon name="globe" size={18} />
              <select
                aria-label={c('Langue', 'Language', '语言')}
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                {languages.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <button className="button primary" onClick={() => router.push('/login')}>
              {c('Se connecter', 'Sign in', '登录')}
            </button>
          </div>
        </header>
        <main>
          <CampusLife lang={lang} workspaceId="public-discovery" />
        </main>
      </div>
    );
  return (
    <div className="account-page">
      <a href="#account-form" className="skip-link">
        {c('Aller au formulaire', 'Skip to form', '跳至表单')}
      </a>
      <header className="account-header">
        <a className="brand" href="#/">
          <AnimatedHubLogo />
        </a>
        <label className="language-picker">
          <Icon name="globe" size={18} />
          <select
            aria-label={c('Langue', 'Language', '语言')}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {languages.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <main className="account-layout">
        <section className="account-intro">
          <span className="eyebrow">XIDIAN INTERNATIONAL HUB</span>
          <h1>
            {c(
              'Votre parcours.\nVotre communauté.\nVotre espace.',
              'Your journey.\nYour community.\nYour workspace.',
              '你的留学之旅。\n你的校园伙伴。\n你的专属空间。',
            )}
          </h1>
          <p>
            {c(
              'Un point d’entrée pour vos études, vos démarches et votre vie à Xidian.',
              'One starting point for your studies, documents and life at Xidian.',
              '学习、证件管理与西电校园生活的共同起点。',
            )}
          </p>
          <div className="account-benefits">
            {[
              ['cap', c('Trouvez votre superviseur', 'Find your supervisor', '寻找导师')],
              [
                'shield',
                c('Anticipez vos échéances', 'Stay ahead of deadlines', '提前管理到期提醒'),
              ],
              [
                'globe',
                c('Prenez part à la vie du campus', 'Be part of campus life', '参与校园生活'),
              ],
            ].map(([icon, label]) => (
              <div key={icon}>
                <span>
                  <Icon name={icon} size={22} />
                </span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>
          <div className="account-local-note">
            <Icon name="info" size={20} />
            <p>
              {c(
                'Prototype local : utilisez des informations fictives. Comptes et données restent sur ce navigateur, sans synchronisation. L’authentification serveur et la vérification des identités restent à connecter.',
                'Local prototype: use fictional information. Accounts and records stay in this browser without synchronization. Server authentication and identity verification are not connected.',
                '本地原型：请使用虚构资料。账户与数据仅保存在当前浏览器，不会同步。尚未连接服务器认证与身份核验。',
              )}
            </p>
          </div>
        </section>
        <section className="account-card" id="account-form">
          <div
            className="account-role-tabs"
            role="tablist"
            onKeyDown={(e) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) || busy) return;
              e.preventDefault();
              const roles = ['student', 'club_leader', 'professor'] as const;
              const next =
                roles[
                  e.key === 'Home'
                    ? 0
                    : e.key === 'End'
                      ? 2
                      : (roles.indexOf(role) + (e.key === 'ArrowRight' ? 1 : 2)) % 3
                ];
              setRole(next);
              setRegister(false);
              setError('');
              document.getElementById('account-tab-' + next)?.focus();
            }}
            aria-label={c('Type de compte', 'Account type', '账户类型')}
          >
            {(['student', 'club_leader', 'professor'] as const).map((r) => (
              <button
                key={r}
                id={'account-tab-' + r}
                role="tab"
                disabled={busy}
                aria-selected={role === r}
                aria-controls="account-panel"
                onClick={() => {
                  setRole(r);
                  setRegister(false);
                  setError('');
                  setReveal(false);
                }}
              >
                <Icon name={r === 'student' ? 'cap' : 'users'} size={20} />
                {r === 'student'
                  ? c('Étudiant', 'Student', '学生')
                  : r === 'club_leader'
                    ? c('Responsable de club', 'Club leader', '社团负责人')
                    : c('Professeur', 'Professor', '教师')}
              </button>
            ))}
          </div>
          <div id="account-panel" role="tabpanel" aria-labelledby={'account-tab-' + role}>
            <span className="account-kicker">
              {role === 'student'
                ? c('ESPACE ÉTUDIANT', 'STUDENT WORKSPACE', '学生空间')
                : role === 'club_leader'
                  ? c('ESPACE RESPONSABLE', 'CLUB LEADER WORKSPACE', '社团负责人空间')
                  : c('ACCÈS PROFESSEUR', 'PROFESSOR ACCESS', '教师访问')}
            </span>
            <h2>
              {role === 'professor'
                ? c(
                    'Bienvenue dans votre espace.',
                    'Welcome to your workspace.',
                    '欢迎进入你的工作空间。',
                  )
                : register
                  ? c(
                      'Créez votre compte étudiant.',
                      'Create your student account.',
                      '创建学生账户。',
                    )
                  : c('Heureux de vous retrouver.', 'Good to see you again.', '欢迎回来。')}
            </h2>
            <p className="muted">
              {role === 'club_leader'
                ? c(
                    'Connectez-vous avec votre compte étudiant nommé responsable par un professeur. Vous gérez uniquement les clubs qui vous sont attribués.',
                    'Sign in with the student account appointed by a professor. You manage only the clubs assigned to you.',
                    '请使用教师任命的学生账户登录。你只能管理所分配的社团。',
                  )
                : role === 'professor'
                  ? c(
                      'Accédez au site complet et à l’espace ISO avec votre code dédié.',
                      'Access the full site and ISO workspace with your dedicated code.',
                      '使用专用访问码，进入完整网站与ISO工作台。',
                    )
                  : register
                    ? c(
                        'Complétez votre profil pour préparer votre parcours.',
                        'Complete your profile to get started.',
                        '完善个人资料，开启你的校园之旅。',
                      )
                    : c(
                        'Retrouvez votre compte enregistré sur cet appareil.',
                        'Open the account saved on this device.',
                        '登录保存在本设备上的账户。',
                      )}
            </p>
            <form key={role + '-' + register} className="account-form" onSubmit={submit}>
              {((register && role === 'student') || role === 'professor') && (
                <label className="field">
                  <span>{c('Nom complet', 'Full name', '姓名')}</span>
                  <input name="displayName" autoComplete="name" required maxLength={120} />
                </label>
              )}
              {role === 'student' && register && (
                <>
                  <div className="two-fields">
                    <label className="field">
                      <span>{c('Matricule étudiant', 'Student ID', '学号')}</span>
                      <input name="studentId" autoCapitalize="characters" required maxLength={40} />
                    </label>
                    <label className="field">
                      <span>{c('Nationalité', 'Nationality', '国籍')}</span>
                      <input name="nationality" required maxLength={80} />
                    </label>
                  </div>
                  <label className="field">
                    <span>{c('Spécialité / major', 'Major', '专业')}</span>
                    <input name="major" required maxLength={120} />
                  </label>
                  <label className="field">
                    <span>{c('Niveau d’études / grade', 'Study level / grade', '学习层次')}</span>
                    <select name="grade" required defaultValue="">
                      <option value="" disabled>
                        {c('Choisir mon niveau', 'Select my level', '选择学习层次')}
                      </option>
                      {[
                        ['Bachelor', c('Licence', 'Bachelor', '本科')],
                        ['Master', c('Master', 'Master', '硕士')],
                        ['PhD', c('Doctorat', 'PhD', '博士')],
                        [
                          'Language program',
                          c('Programme de langue', 'Language program', '语言项目'),
                        ],
                      ].map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>
                      {c(
                        'Téléphone avec indicatif',
                        'Phone with country code',
                        '电话号码（含国家区号）',
                      )}
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      required
                      maxLength={26}
                      placeholder="+86 …"
                    />
                  </label>
                </>
              )}
              {((register && role === 'student') || role === 'professor') && (
                <label className="field">
                  <span>{c('Email', 'Email', '电子邮箱')}</span>
                  <input type="email" name="email" autoComplete="email" required maxLength={160} />
                </label>
              )}
              {role !== 'professor' && !(register && role === 'student') && (
                <label className="field">
                  <span>
                    {c('Email ou matricule étudiant', 'Email or student ID', '邮箱或学号')}
                  </span>
                  <input name="identifier" autoComplete="username" required maxLength={160} />
                </label>
              )}
              <label className="field">
                <span>
                  {role === 'professor'
                    ? c('Code d’accès spécial', 'Special access code', '专用访问码')
                    : c('Mot de passe', 'Password', '密码')}
                </span>
                <div className="account-password">
                  <input
                    name={role === 'professor' ? 'code' : 'password'}
                    type={reveal ? 'text' : 'password'}
                    autoComplete={
                      role === 'professor' ? 'off' : register ? 'new-password' : 'current-password'
                    }
                    required
                    minLength={role === 'professor' ? 1 : 8}
                    maxLength={128}
                  />
                  <button type="button" onClick={() => setReveal(!reveal)} aria-pressed={reveal}>
                    {reveal ? c('Masquer', 'Hide', '隐藏') : c('Afficher', 'Show', '显示')}
                  </button>
                </div>
                {register && role === 'student' && (
                  <small>
                    {c(
                      'Au moins 8 caractères. Utilisez un mot de passe réservé à cette démo.',
                      'At least 8 characters. Use a password only for this demo.',
                      '至少8个字符，请使用仅用于此演示的密码。',
                    )}
                  </small>
                )}
              </label>
              {register && role === 'student' && (
                <label className="field">
                  <span>{c('Confirmer le mot de passe', 'Confirm password', '确认密码')}</span>
                  <input
                    name="confirm"
                    type={reveal ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={128}
                  />
                </label>
              )}
              {error && (
                <p role="alert" className="error-message">
                  {errors[error] ||
                    c(
                      'Le stockage du navigateur est indisponible. Vérifiez ses réglages puis réessayez.',
                      'Browser storage is unavailable. Check its settings and try again.',
                      '浏览器存储不可用，请检查设置后重试。',
                    )}
                </p>
              )}
              <button className="button primary full" disabled={busy}>
                {busy
                  ? c('Ouverture de votre espace…', 'Opening your workspace…', '正在打开空间…')
                  : role === 'student' && register
                    ? c('Créer mon compte', 'Create my account', '创建账户')
                    : c('Se connecter', 'Sign in', '登录')}
              </button>
            </form>
            {role === 'student' && (
              <div className="account-switch">
                <span>
                  {register
                    ? c(
                        'Déjà un compte sur cet appareil ?',
                        'Already have an account on this device?',
                        '本设备已有账户？',
                      )
                    : c('Première visite ?', 'First time here?', '首次访问？')}
                </span>
                <button
                  className="text-button"
                  disabled={busy}
                  onClick={() => {
                    setRegister(!register);
                    setError('');
                    setReveal(false);
                  }}
                >
                  {register
                    ? c('Se connecter', 'Sign in', '登录')
                    : c('Créer un compte étudiant', 'Create a student account', '创建学生账户')}
                </button>
              </div>
            )}
            <p className="account-access-note">
              <Icon name="shield" size={16} />
              {role === 'student'
                ? c(
                    'Espace personnel étudiant · sans accès ISO',
                    'Personal student workspace · no ISO access',
                    '学生个人空间 · 无ISO访问权限',
                  )
                : role === 'club_leader'
                  ? c(
                      'Compte étudiant + gestion de mes clubs · sans accès ISO',
                      'Student account + my club management · no ISO access',
                      '学生账户与负责社团管理 · 无ISO访问权限',
                    )
                  : c(
                      'Accès professeur de démonstration · toutes les rubriques',
                      'Demo professor access · all sections',
                      '教师演示访问 · 全部栏目',
                    )}
            </p>
          </div>
        </section>
      </main>
      <div className="account-public-link">
        <a className="text-button" href="#/clubs">
          {c('Explorer les clubs', 'Explore clubs', '探索社团')}
        </a>
      </div>
      <footer className="account-footer">
        {c(
          'Initiative étudiante indépendante · prototype non officiel',
          'Independent student initiative · unofficial prototype',
          '独立学生倡议 · 非官方原型',
        )}
      </footer>
    </div>
  );
}
