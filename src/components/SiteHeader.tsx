import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import AccountButton from './AccountButton';

/** 站点层顶栏 —— 只有首页使用；各课程页面自带导航栏，与本组件无关。 */
export default function SiteHeader() {
  return (
    <header className="hub-topbar">
      <Link to="/" className="hub-brand nav-pill">
        HFUT-CS-Online
      </Link>
      <div className="hub-topbar-right">
        <div className="topbar-ctl nav-pill">
          <ThemeToggle />
        </div>
        <AccountButton />
      </div>
    </header>
  );
}
