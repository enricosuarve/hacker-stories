import * as React from "react";

const welcome = {
    greeting: 'Hey',
    title: 'React',
};


const getTitle = (title) => {
    console.log('getting title');
    return title;
}

const App = () => {
    console.log('App renders');

    const [searchTerm, setSearchTerm] = React.useState(
        localStorage.getItem('search') || 'react'
    );

    React.useEffect(() => {
        localStorage.setItem('search', searchTerm);
    }, [searchTerm]);

    const stories = [
        {
            title: 'React',
            url: 'https://reactjs.org',
            author: 'Jordan Walke',
            num_comments: 3,
            points: 4,
            objectID: 0,
            test: "test extra prop"
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

    const handleSearch = (event) => {
        console.log('handleSearch: ' + event.target.value);
        setSearchTerm(event.target.value);
    };

    const searchedStories = stories.filter(function (story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <h1>
                {welcome.greeting} {welcome.title}<br/>
                Hello {getTitle('React')}
            </h1>
            <Search onSearch={handleSearch} searchTerm={searchTerm}/>
            <List list={searchedStories} extraline={"test"}/>
        </div>
    );
}


const List = ({list}) => (
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
            />
        ))}
    </ul>
)


const Item = ({item}) => (
    <li>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <ul>
            <li>{item.author}</li>
            <li>{item.num_comments}</li>
            <li>{item.points}</li>
        </ul>
    </li>
)

const Search = ({search, onSearch}) => (
    <div>
        <label htmlFor="search">Search: </label>
        <input
            id="search"
            type="text"
            onChange={onSearch}
            value={search}
        />
    </div>
)


export default App;
