import { useState } from "react";
import { Deck } from "../src/deck";
import { getWinners } from "../src/drawsValidations";
import { handToString } from "../src/rules";
import Link from "next/link";
import { useRouter } from "next/router";
import { isLogged } from "./login";
import { useEffect } from "react";
import react from "react";

export function refreshPage() {
  window.location.reload();
}

export default function Menu() {
  const [userToken, setUserToken] = useState();
  const [user, setUser] = useState({ username: "" });
  const router = useRouter();

  const handleLogout = () => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken }),
    };
    fetch("/api/logout", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    localStorage.clear();
    refreshPage();
  };

  const getUserAll = () => {
    if (userToken === null || userToken === undefined) {
      return;
    }
    const options = { method: "GET", headers: { token: userToken } };
    fetch("/api/login", options)
      .then((response) => response.json())
      .then((response) => setUser(response.user))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setUserToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    getUserAll();
  }, [userToken]);

  useEffect(() => {
    setTimeout(() => {
      setUserToken(localStorage.getItem("token"));
    }, 10);
  }, [router.asPath]);

  return (
    <div className="menu">
      <div className="abas">
        <Link href="/home">
          <a>
            <button disabled={router.asPath === "/home"}>Home</button>
          </a>
        </Link>
        <Link href="/rules">
          <a>
            <button disabled={router.asPath === "/rules"}>Rules</button>
          </a>
        </Link>
        <Link href="/how-to-play">
          <a>
            <button disabled={router.asPath === "/how-to-play"}>
              How To Play
            </button>
          </a>
        </Link>
        <Link href="/about-us">
          <a>
            <button disabled={router.asPath === "/about-us"}>About Us</button>
          </a>
        </Link>
      </div>
      {!userToken ? (
        <div className="auth">
          <Link href="/login">
            <a>
              <button disabled={router.asPath === "/login"}>Login</button>
            </a>
          </Link>
          <Link href="/register">
            <a>
              <button disabled={router.asPath === "/register"}>Register</button>
            </a>
          </Link>
        </div>
      ) : (
        <div className="isLoggedIn">
          <img src={'/chips-assets/ficha-gold-As.png'} className={'playerChipIcon'} alt="chips" />
          <button disabled>Chips: {user.chips}</button>
          <button disabled>{user.username}</button>
          <Link href="/home">
            <a>
              <button onClick={() => handleLogout()}>Logout</button>
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
