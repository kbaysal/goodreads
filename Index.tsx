import * as React from 'React';

interface IMap<T> {
    [key: string]: T
}

interface indexProps {
    book?: IMap<string>;
}

const cyan = "#0d8888";

const headerStyle: React.CSSProperties = {
    color: cyan,
    textAlign: "center"
}

const bodyStyle: React.CSSProperties = {
    fontSize: 16,
    fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
}

const titleStyle: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: 30,
    lineHeight: "1.2em",
    flex: "1 1 auto",
}

const appStyle: React.CSSProperties = {
    width: "70%",
    maxWidth: 1000,
    minWidth: 300,
    margin: "0 auto",
    marginBottom: 150
}

const titleImageStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center"
}

const descriptionStyle: React.CSSProperties = {
    textAlign: "justify"
}

const grLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: cyan,
}

const newBookStyle: React.CSSProperties = {
    ...grLinkStyle,
    color: "white",
    fontWeight: "bold"
}

const loginStyle: React.CSSProperties = {
    margin: "20px auto",
    padding: 12,
    width: "fit-content",
}

const smallLogoStyle: React.CSSProperties = {
    position: "relative",
    top: 2
}

const gridStyle = {
    display: "grid",
    width: "fit-content",
    gridGap: "5px 10px"
}

const footerStyle: React.CSSProperties = {
    position: "fixed",
    width: "70%",
    bottom: 0,
    margin: "0 auto",
    display: "flex",
    background: "linear-gradient(transparent, white, white, white)",
    padding: "60px 0 20px 0",
    alignItems: "center",
    maxWidth: 1000,
    minWidth: 300,
}

const newBookContainerStyle = {
    padding: 12,
    width: "fit-content",
    backgroundColor: cyan
}

const homepage = (props: indexProps) => {
    return (<html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" type="text/css" href="/Static/css/styles.css" />
            <title>Goodreads Randomizer</title>
        </head>
        <body style={bodyStyle}>
            <div id="main" style={appStyle}>
                {
                    !props.book ?
                        renderHomepage() :
                        renderBook(props.book)
                }
            </div>
            <script type="text/javascript" src="/Static/js/bundle.js" />
        </body>
    </html>)
}

function renderHomepage() {
    return (
        <div>
            <div style={{ textAlign: "center" }}>
                {getHeader()}
                <p>You have a lot of books in your shelves but not sure what to read?</p>
                <p>Dare to let us pick a random book for you from your "to read" shelf in Goodreads</p>
                <p>All you have to do is login right below</p>
            </div>
            <div style={loginStyle}>
                <a href="/login">
                    <img src="https://s.gr-assets.com/assets/badge/goodreads-login-button-7bd184d3077cf3580f68aa8a00de39ce.png" />
                </a>
            </div>
        </div>
    );
}

function renderBook(book: IMap<string>) {
    return (
        <div id="book">
            {getHeader()}
            <h3>Here's what we found for you...</h3>
            <div style={titleImageStyle}>
                <h2 id="title" style={titleStyle}>{book.title}</h2>
                <img src={book.image_url} />
            </div>
            <p dangerouslySetInnerHTML={{ __html: book.description }} style={descriptionStyle}></p>
            <div style={gridStyle}>
                <span style={{ fontWeight: "bold" }}> Average rating:</span>
                <span style={{ gridColumn: 2 }}>{book.average_rating}</span>
                <span style={{ fontWeight: "bold" }}> Number of pages:</span>
                <span>{book.num_pages}</span>
            </div>
            <div style={{ marginTop: "20px" }}>
                <a href={book.link} style={grLinkStyle}><img style={smallLogoStyle} src="https://s.gr-assets.com/assets/icons/goodreads_icon_16x16-fc141070fc3ea1a7cd145a4af570ec14.png" /> See the Goodreads page</a>
            </div>
            <div style={footerStyle}>
                <p style={{ margin: "0 20px 0 0" }}>
                    It's more fun to take the risk, but if you don't like this book, you can get another
                </p>
                <div style={newBookContainerStyle}>
                    <a href="/" style={newBookStyle}>Get me another book</a>
                </div>
            </div>
        </div>);
}

function getHeader() {
    return (<h1 style={headerStyle}>Goodreads Randomizer</h1>);
}

export default homepage;