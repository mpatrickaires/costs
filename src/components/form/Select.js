import styles from './Select.module.css';

function Select({ text, name, options, handleOnChange, value }) {
    options = Array.from(options);
    
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <select name={name} id={name}>
                <option>Selecione uma opção</option>
                {options.map((option) => (
                    <option id={option.id} key={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
