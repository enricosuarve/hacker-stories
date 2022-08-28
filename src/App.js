import * as React from "react";

const welcome = {
    greeting: 'Hey',
    title: 'React',
};

const list = [
    {
        title: 'React',
        url: 'https://reactjs.org',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
        test: "wwwww"
    },
    {
        title: 'Redux',
        url: 'https://reduc.js.org',
        author: 'Dan Abrmov, Andrew Clarke',
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
];

const getTitle = (title) => {
    return title;
}

const App = () => (
    <div>
        <h1>
            {welcome.greeting} {welcome.title}<br/>
            Hello {getTitle('React')}
        </h1>
        <Search/>
        <List/>
    </div>
);


const List = () => (
    <ul>
        {list.map((item) => (
            <li key={item.objectID} id={item.test}>
                {item.title}
                <ul>
                    <li>{item.url}</li>
                </ul>
            </li>
        ))}
    </ul>
);


const Search = () => (
    <span>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text"/>
    </span>
);


export default App;
