async function loadData() {
    console.log("Aquí estoy 1");
    try {
        const userQuery = `
            query {
                users {
                    id
                    name
                    email
                    book {
                    id
                    name
                    author
                    }
                }
            }
        `;

        const response = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: userQuery })
        });

        if (!response.ok) {
            throw new Error(`¡Error HTTP! Estado: ${response.status}`);
        }

        const result = await response.json();
        return result.data.users; // Devolver los datos de usuarios obtenidos desde GraphQL
    } catch (err) {
        console.error('Error al obtener datos:', err);
        return null;
    }
}

loadData()
    .then(users => {
        if (!users) return; // Salir si no hay datos de usuarios

        console.log(users); // Verifica la estructura de los datos

        const userCount = document.querySelector("#user-count");
        if (userCount) {
            userCount.textContent = users.length; // Actualizar el número de usuarios
            console.log(`Cantidad de usuarios: ${users.length}`);
        } else {
            console.error('Elemento #user-count no encontrado');
        }

        const tBody = document.querySelector("#tBody"); // Si tienes una tabla para mostrar los usuarios
        if (tBody) {
            tBody.innerHTML = ''; // Limpiar contenido previo de la tabla

            users.forEach(user => {
                const row = document.createElement('tr');

                const colName = document.createElement('td');
                colName.textContent = user.name;
                row.appendChild(colName);

                const colEmail = document.createElement('td');
                colEmail.textContent = user.email;
                row.appendChild(colEmail);

                const colNameBook = document.createElement('td');
                colNameBook.textContent = user.book ? user.book.name : 'N/A';
                row.appendChild(colNameBook);

                const colUserId = document.createElement('td');
                colUserId.textContent = user.id;
                row.appendChild(colUserId);

                tBody.appendChild(row);
            });
        } else {
            console.error('Elemento #tBody no encontrado');
        }
    })
    .catch(err => console.error('Error al procesar datos:', err));