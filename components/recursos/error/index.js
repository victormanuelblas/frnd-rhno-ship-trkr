import './style.sass'


function AvisoError({msg}) {
    return (
      <div className="error-content">
        <section id='error-mensaje'>
          <b>{msg}</b>
        </section>
      </div>
    )
}

export default AvisoError;
