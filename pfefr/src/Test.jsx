import React from 'react';
import './Test.css'; // Assurez-vous que votre fichier CSS est correctement importé
import platImage from './images/sushi.jpg'; // Importez l'image du plat
import fraises from './images/fraises.png'; // Importez l'image des fraises
import myrtilles from './images/myrtilles.png'; // Importez l'image des myrtilles

function Test() {
  return (
    <div className="page-container">
      <header className="header">
        <div className="logo-container">
          <div className="avatar"></div>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#">Menu</a></li>
            <li><a href="#">Lunch Boxes</a></li>
            <li><a href="#">Platters</a></li>
            <li><a href="#">Specials</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="text-content">
            <p className="chef-special">CHEF'S SPECIAL</p>
            <h1>Every bite is Freshness & Yummy!</h1>
            <p className="quote">"Health is a state of complete physical, mental, and social well-being and not merely the absence of disease or infirmity."</p>
            <button className="download-btn">Download recipe</button>
          </div>
          <div className="image-content">
            <img src={platImage} alt="Plat spécial du chef" className="plat-image" />
            <img src={fraises} alt="Fraises" className="fraises" />
            <img src={myrtilles} alt="Myrtilles" className="myrtilles" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Test;