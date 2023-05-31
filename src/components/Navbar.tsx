import Link from 'next/link';
import styles from '../styles/Constants.module.css'

const Navbar = () => (
  <nav className={styles.navbar}>
    <h1>Hi, I&rsquo;m Tom.</h1>  
    <Link href="/">
      LinkedIn
    </Link>
    <Link href="/">
      About
    </Link>
    <Link href="/">
      Contact
    </Link>
  </nav>
);

export default Navbar;
