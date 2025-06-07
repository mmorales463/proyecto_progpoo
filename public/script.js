document.addEventListener("DOMContentLoaded", function () {
  const formBox = document.getElementById("form-box");
  const overlayBox = document.getElementById("overlay-box");

  const sendUserData = (data) => {
    fetch("/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
      alert(response.mensaje);
      window.location.href = "login.html";
    })
    .catch(err => {
      alert("Error al guardar el formulario");
      console.error(err);
    });
  };

  const path = window.location.pathname;

  if (formBox && path.includes("registro.html")) {
    formBox.innerHTML = `
      <h2>CREAR CUENTA</h2>
      <form id="registroForm">
        <label for="nombre">Nombre completo :</label>
        <input type="text" id="nombre" name="nombre" required>

        <label for="email">Correo Electrónico :</label>
        <input type="email" id="email" name="email" required pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$">

        <label for="direccion">Dirección :</label>
        <input type="text" id="direccion" name="direccion" required>

        <label for="password">Contraseña :</label>
        <input type="password" id="password" name="password" required minlength="8">

        <label for="confirmar">Confirmar Contraseña :</label>
        <input type="password" id="confirmar" name="confirmar" required minlength="8">

        <button type="submit">CREAR CUENTA</button>
      </form>
      <p><a href="index.html">Home</a> | <a href="login.html">Login</a></p>
    `;

    document.getElementById("registroForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const password = document.getElementById("password").value;
      const confirmar = document.getElementById("confirmar").value;

      if (password !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      const data = {
        tipo: "registro",
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        direccion: document.getElementById("direccion").value,
        password: password
      };

      sendUserData(data);
    });
  }

  if (formBox && path.includes("login.html")) {
    formBox.innerHTML = `
      <h2>LOGIN DE TU CUENTA</h2>
      <form id="loginForm">
        <label for="usuario">Usuario :</label>
        <input type="text" id="usuario" name="usuario" required>

        <label for="correo">Correo Electrónico :</label>
        <input type="email" id="correo" name="correo" required pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$">

        <label for="clave">Contraseña :</label>
        <input type="password" id="clave" name="clave" required minlength="8">

        <button type="submit">LOGIN</button>
      </form>
      <p><a href="index.html">Home</a> | ¿No tienes cuenta? <a href="registro.html">Crear cuenta</a></p>
    `;

    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const correo = document.getElementById("correo").value.trim();
      const clave = document.getElementById("clave").value;

      if (!usuario || !correo || clave.length < 8) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
      }

      fetch("/usuarios")
        .then(res => res.json())
        .then(users => {
          const match = users.find(u =>
            u.nombre === usuario &&
            u.email === correo &&
            u.password === clave
          );

          if (match) {
            alert("Inicio de sesión exitoso. Bienvenido " + match.nombre);
            window.location.href = "index.html";
          } else {
            alert("Credenciales incorrectas. Intenta nuevamente.");
          }
        })
        .catch(err => {
          alert("Error verificando usuarios");
          console.error(err);
        });
    });
  }

  if (overlayBox && path.includes("index.html")) {
    const heading = document.createElement("h1");
    heading.innerHTML = "TODOS LO QUE NECESITAS<br>CREAR<br>PARA PODER CRECER";

    const button = document.createElement("a");
    button.href = "registro.html";
    button.className = "main-btn";
    button.textContent = "Comenzar a crear ›";

    overlayBox.appendChild(heading);
    overlayBox.appendChild(button);

    const loginLink = document.querySelector(".start-btn");
    if (loginLink) loginLink.href = "login.html";
  }
});
