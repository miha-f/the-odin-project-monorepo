import './Header.css'

const Header = ({ isEditMode, toggleEditMode }) => {
    return (
        <header class="site-header">
            <button onClick={toggleEditMode}>
                {isEditMode ? 'View' : 'Edit'}
            </button>
        </header>
    );
}

export default Header;
