import Link from 'next/link';
import styles from '../styles/Constants.module.css'

const Footer = () => (
    <footer className={styles.footer}>
        <p>
            <Link href="https://github.com/thomaslillo">
                Github
            </Link>
            <Link href="https://www.linkedin.com/in/thomaslillo/">
                LinkedIn
            </Link>
        </p>
    </footer>
);

export default Footer;
