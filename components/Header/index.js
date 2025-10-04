import './style.sass'
import Link from 'next/link'

function Header() {

    return (
    <header>
        <section id='welcome'>
            BIENEVENIDO A NUESTRO PORTAL
        </section>
        <section id='options-menu'>
          <h2 className="logo">
            <img alt="Rhinoseller" src="/assets/home/logo-prin.png" />
          </h2>
          <input type="checkbox" id="check" ></input>
          <label htmlFor="check" className="mostrar-menu">
            &#8801;
          </label>
          <nav className="menu">
            <Link href="/">Inicio</Link>
            <Link href="#">Propósito</Link>
            <Link href="#">Nosotros</Link>
            <Link href="#">Envíos</Link>
            <label htmlFor="check" className='esconder-menu'>
              &#215;
            </label>
          </nav>
        </section>
    </header>  
    )
}

export default Header;
