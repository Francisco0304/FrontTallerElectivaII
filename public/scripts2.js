console.log("holaa")

async function registrar() {
    try {
        console.log("aqui estoy 1")
        // Obtener los valores del formulario
        const year = document.getElementById("yearInput").value;
        const name = document.getElementById("titleInput").value;
        const pages = document.getElementById("pagesInput").value;
        const author = document.getElementById("authorInput").value;
        
        console.log(year);
        // Crear el objeto de datos del libro
        const data = {
            query: `
                mutation CreateBook($year: Int!, $name: String!, $pages: Int!, $author: String!) {
                    createBook(year: $year, name: $name, pages: $pages, author: $author, status: true) {
                        id
                        year
                        name
                        pages
                        author
                        status
                    }
                }
            `,
            variables: {
                year: parseInt(year),
                name: name,
                pages: parseInt(pages),
                author: author,
            }
        };

        // Realizar la solicitud POST a GraphQL
        const response = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Verificar si la respuesta fue exitosa
        const responseData = await response.json();
        if (responseData.errors) {
            // Si hay errores, mostrar mensaje de error
            console.error('Hubo un error al guardar el libro:', responseData.errors);
            alert('Hubo un error al guardar el libro. Por favor, inténtalo de nuevo.');
        } else {
            // Si la respuesta es exitosa, mostrar mensaje de éxito
            console.log('Libro guardado exitosamente:', responseData.data.createBook);
            alert('¡Libro guardado exitosamente!');
            window.location.href = "http://localhost:3200/"; // Redirigir a la página principal o donde sea necesario
        }
    } catch (error) {
        // Si hay algún error en la solicitud, mostrar mensaje de error
        console.error('Error al enviar la solicitud:', error);
        alert('Error al guardar el libro. Por favor, inténtalo de nuevo.');
    }
}

// Asignar evento de clic al botón guardar
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveButton').addEventListener('click', registrar);
});
