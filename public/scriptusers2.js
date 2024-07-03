console.log("holaa");

async function registrar() {
    try {
        console.log("aqui estoy 1");
        // Obtener los valores del formulario
        const userName = document.getElementById("userInput").value;
        const userEmail = document.getElementById("mailInput").value;
        const bookName = document.getElementById("nameInput").value;

        console.log(bookName);
        // Realizar la solicitud GraphQL para obtener el ID del libro
        const bookQuery = `
            query FindBookByName($name: String!) {
                findBookByName(name: $name) {
                    id
                    year
                    name
                    pages
                    author
                    status
                    users {
                        id
                        name
                        email
                    }
                }
            }
        `;

        const bookResponse = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query: bookQuery,
                variables: { name: bookName }
            }),
        });

        if (!bookResponse.ok) {
            throw new Error(`HTTP error! Status: ${bookResponse.status}`);
        }

        const bookData = await bookResponse.json();
        console.log(bookData);

        if (!bookData.data.findBookByName) {
            throw new Error(`No se encontró ningún libro con el nombre ${bookName}`);
        }

        const bookId = bookData.data.findBookByName.id;

        console.log("aqui estoy 3");
        // Crear el objeto de datos del usuario
        const userData = {
            name: userName,
            email: userEmail,
        };

        console.log("aqui estoy 4");
        // Verificar si el libro está disponible
        if (!bookData.data.findBookByName.status) {
            throw new Error(`El libro ${bookName} no está disponible para préstamo`);
        }

        console.log("aqui estoy 5");
        // Realizar la solicitud GraphQL para agregar al usuario al libro correspondiente
        const userCreation = `
        mutation {
            createUser(name: "${userName}", email: "${userEmail}", bookId: "${bookId}") {
                id
                name
                email
                book {
                    id
                }
            }
        }
    `;

    console.log("aqui estoy 6");
    const response = await fetch("http://localhost:3600", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userCreation }),
    });

        console.log("aqui estoy 7");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const borrowedUser = responseData.data.borrowBook;

        // Actualizar el estado del libro a 'unavailable' usando GraphQL
        const updateMutation = `
            mutation {
                updateBook(id: "${bookId}", status: false) {
                    id
                    status
                }
            }
        }
        `;

        console.log("aqui estoy 8");

        const updateResponse = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: updateMutation,
                variables: { bookId }
            }),
        });

        console.log("aqui estoy 9");
        if (updateResponse.ok) {
            // Si la actualización es exitosa, mostrar mensaje de éxito
            console.log('Préstamo realizado exitosamente y estado del libro actualizado');
            alert('¡Préstamo realizado exitosamente y estado del libro actualizado!');
            window.location.href = "http://localhost:3200/";
        } else {
            // Si la actualización no es exitosa, mostrar mensaje de error
            console.error('Hubo un error al actualizar el estado del libro:', updateResponse.status);
            alert('Préstamo realizado.');
            window.location.href = "http://localhost:3200/";
        }
    } catch (error) {
        // Si hay algún error en la solicitud, mostrar mensaje de error
        console.error('Error al enviar la solicitud:', error);
        alert(error.message);
    }
}
