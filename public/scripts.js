async function loadData() {
    console.log("Aquí estoy 1");
    const query = `
        query {
            books {
                id
                year
                name
                pages
                author
                status
            }
        }
    `;

    try {
        const response = await fetch("http://localhost:3600", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`¡Error HTTP! Estado: ${response.status}`);
        }

        const result = await response.json();
        return result.data.books; // Devolver los datos de libros obtenidos desde GraphQL
    } catch (err) {
        console.error('Error al obtener datos:', err);
        return null;
    }
}

loadData()
    .then(books => {
        if (!books) return; // Salir si no hay datos de libros

        console.log(books); // Verifica la estructura de los datos

        const bookCount = document.querySelector("#book-count");
        if (bookCount) {
            bookCount.textContent = books.length; // Actualiza el número de libros
            console.log(`Cantidad de libros: ${books.length}`);
        } else {
            console.error('Elemento #book-count no encontrado');
        }

        const tBody = document.querySelector("#tBody"); // Si tienes una tabla para mostrar los libros
        if (tBody) {
            tBody.innerHTML = ''; // Limpiar contenido previo de la tabla

            books.forEach(book => {
                const row = document.createElement('tr');

                const colYear = document.createElement('td');
                colYear.textContent = book.year;
                row.appendChild(colYear);

                const colName = document.createElement('td');
                colName.textContent = book.name;
                row.appendChild(colName);

                const colPages = document.createElement('td');
                colPages.textContent = book.pages;
                row.appendChild(colPages);

                const colAuthor = document.createElement('td');
                colAuthor.textContent = book.author;
                row.appendChild(colAuthor);

                tBody.appendChild(row);
            });
        } else {
            console.error('Elemento #tBody no encontrado');
        }
    })
    .catch(err => console.error('Error al procesar datos:', err));
