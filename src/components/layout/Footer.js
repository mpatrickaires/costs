import { FaLinkedin, FaGithub } from 'react-icons/fa';

import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <ul className={styles.social_list}>
                <li>
                    <a
                        href="https://www.linkedin.com/in/mpatrickaires/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaLinkedin />
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.github.com/mpatrickaires"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaGithub />
                    </a>
                </li>
            </ul>
            <p className={styles.copy_right}>
                <span>Costs</span> &copy; 2021
            </p>
        </footer>
    );
}

export default Footer;
