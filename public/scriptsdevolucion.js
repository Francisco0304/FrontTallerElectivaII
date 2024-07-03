// scriptsdevolucion.js

async function realizarDevolucion() {
    try {
        // Obtener el ID del usuario desde el campo de texto
        const userID = document.getElementById("bookIDInput").value;
        console.log("ID del usuario:", userID);

        // Realizar la solicitud para obtener la información del usuario mediante GraphQL
        const userQuery = `
            query GetUser($id: ID!) {
                user(id: $id) {
                    id
                    name
                    email
                    book {
                        id
                        name
                        status
                    }
                }
            }
        `;
        
        const userData = {
            query: userQuery,
            variables: {
                id: userID
            }
        };

        const userResponse = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!userResponse.ok) {
            throw new Error(`HTTP error! Status: ${userResponse.status}`);
        }

        // Obtener la información del usuario
        const userDataJson = await userResponse.json();
        const user = userDataJson.data.user;
        console.log(user);

        // Verificar si se encontró el usuario
        if (!user) {
            throw new Error(`El usuario con ID ${userID} no se encontró.`);
        }

        // Obtener el ID del libro asociado al usuario
        const libroID = user.book.id;

        // Cambiar el estado del libro a "available" mediante GraphQL
        const updateBookMutation = `
            mutation UpdateBook($id: ID!, $status: Boolean!) {
                updateBook(id: $id, status: $status) {
                    id
                    status
                }
            }
        `;

        const updateBookData = {
            query: updateBookMutation,
            variables: {
                id: libroID,
                status: true
            }
        };

        const updateResponse = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateBookData)
        });

        if (!updateResponse.ok) {
            throw new Error(`Error actualizando libro! Status: ${updateResponse.status}`);
        }

        // Realizar la solicitud DELETE para eliminar al usuario mediante GraphQL
        const deleteMutation = `
            mutation deleteUser($id: ID!) {
                deleteUser(id: $id) {
                    id
                }
            }
        `;

        const deleteUserData = {
            query: deleteMutation,
            variables: {
                id: userID
            }
        };

        const deleteResponse = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteUserData)
        });

        if (!deleteResponse.ok) {
            throw new Error(`Error eliminando usuario! Status: ${deleteResponse.status}`);
        }

        // Mostrar mensaje de éxito
        alert(`Devolución realizada para el libro con ID ${libroID}. Estado actualizado a "available".`);

        // Limpiar el campo de texto
        document.getElementById("bookIDInput").value = '';
        window.location.href = "http://localhost:3200"; // Redirigir a la página principal o donde sea necesario
    } catch (error) {
        // Manejar errores
        console.error('Error realizando devolución:', error);
        alert('Ocurrió un error al realizar la devolución del libro.');
    }
}

// Asignar el evento de clic al botón "Realizar devolución libro"
document.querySelector("#btnRealizarDevolucion").addEventListener("click", realizarDevolucion);
