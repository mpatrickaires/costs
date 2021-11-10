import { useState, useEffect } from 'react';

import styles from './Message.module.css';

function Message({ type, msg, msgHandler }) {
    const [visible, setVisible] = useState(false);

    function clearMsg() {
        msgHandler('');
    }

    useEffect(() => {
        if (!msg) {
            setVisible(false);
            return;
        }

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            clearMsg();
        }, 3000);

        return () => clearTimeout(timer);
    }, [msg]);

    return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
            )}
        </>
    );
}

export default Message;
