import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { faReact } from '@fortawesome/free-brands-svg-icons';

function Header() {
    const { isLoggedIn, user: getUser } = useAuthStore();
    const user = getUser();

    return (
        <header className="navbar-dark bg-dark navbar-sticky header-static">
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon
                                icon={faReact}
                                spin
                                size="2x"
                                style={{ marginRight: '10px', color: "#61dafb" }}
                            />
                            <FontAwesomeIcon
                                icon={faPython}
                                size="2x"
                                // style={{ color: "#306998" }}
                            />
                        </div>
                    </Link>

                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="h6 d-none d-sm-inline-block text-white">Menu</span>
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarCollapse">

                        <ul className="navbar-nav navbar-nav-scroll ms-auto">
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/search/">
                                    Search Articles
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle active" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Your Posts
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                    <li>
                                        <Link className="dropdown-item" to="/posts/">
                                            <i className="bi bi-grid-fill"></i> Posts
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/add-post/">
                                            <i className="fas fa-plus-circle"></i> Add Post
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/comments/">
                                            <i className="bi bi-chat-left-quote-fill"></i> Comments
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/notifications/">
                                            <i className="fas fa-bell"></i> Notifications
                                        </Link>
                                    </li>

                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/about/">
                                    <i className="bi bi-person-lines-fill"></i> About
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/contact/">
                                    <i className="bi bi-telephone-fill"></i>Contact
                                </Link>
                            </li>


                            <li className="nav-item">
                                {isLoggedIn() ? (
                                    <>
                                        <Link className="btn text-white" to="/profile/">
                                            <i className="fas fa-user-gear"></i> Profile
                                        </Link>

                                        <Link to={"/dashboard/"} className="btn text-white " href="dashboard.html">
                                            Dashboard <i className="bi bi-grid-fill"></i>
                                        </Link>
                                        <Link to={"/logout/"} className="btn btn-danger ms-2" href="dashboard.html">
                                            Logout <i className="fas fa-sign-out-alt"></i>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to={"/register/"} className="btn btn-success" href="dashboard.html">
                                            Register <i className="fas fa-user-plus"></i>
                                        </Link>
                                        <Link to={"/login/"} className="btn btn-success ms-2" href="dashboard.html">
                                            Login <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    </>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
