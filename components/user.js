const User = () => {
    return (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle user-options-button d-flex align-items-center" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                <div>
                    <img className="user-options-img" src="http://localhost:3000/_next/image?url=http%3A%2F%2Flocalhost%3A1337%2Fuploads%2Fthe_internet_s_own_boy_458776dd00.jpg&w=1920&q=75" alt="" />
                </div>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                <li><button className="dropdown-item" type="button">Profile</button></li>
                <li><button className="dropdown-item" type="button">Account</button></li>
                <li><button className="dropdown-item" type="button">Settings</button></li>
                <li><button className="dropdown-item" type="button">Logout</button></li>
            </ul>
        </div>
    )
}

export default User