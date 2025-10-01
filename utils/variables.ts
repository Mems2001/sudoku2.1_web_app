interface Urls {
    url_prefix: string,
    socket_url: string,
    share_link_prefix: string
}

const urls:Urls = {
    url_prefix : 'https://sudoku-db-ip9b.onrender.com',
    socket_url: 'https://sudoku-db-ip9b.onrender.com',
    share_link_prefix: 'https://sudoku21.netlify.app/'
}

// LOCAL
// const urls:Urls = {
//     url_prefix : 'http://localhost:443',
//     socket_url: 'http://localhost:443',
//     share_link_prefix: 'http://localhost:5173'

// }

export default urls