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

    const [searchTerm, setSearchTerm] = React.useState('react');
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
    }

    const searchedStories = stories.filter(function (story){
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    })

    return (
        <div>
            <h1>
                {welcome.greeting} {welcome.title}<br/>
                Hello {getTitle('React')}
            </h1>
            <Search onSearch={handleSearch} searchTerm={searchTerm}/>
            <List list={searchedStories} extraline={"test"}/>
            <button onClick={function test(){document.getElementById('search').value = "redux"}} value={"click"}/>
        </div>
    );
}


const List = (props) => {
    console.log('List renders');
    return (
        <ul>
            {props.list.map((item) => (
                <Item key={item.objectID} item={item} extraline={" test"}/>
            ))}
        </ul>
    );
}

const Item = (props) => {
    console.log("Item renders")
    return (
        <li key={props.item.objectID} id={props.item.test}>
            {props.item.title}
            &nbsp;{props.extraline}
            <ul>
                <li>{props.item.url}</li>
            </ul>
        </li>

    );
}

const Search = (props) => {
    console.log('Search Renders');
    const handleChange = (event) => {
        //synthetic event
        console.log(event);
        //value of target (here; element)
        console.log('Search handleChange: ' + event.target.value);
        props.onSearch(event)
    };
    React.useState()
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input
                id="search"
                type="text"
                onChange={handleChange}
                value={props.onSearch}
            />
            <p>
                Searching for: <strong>{props.searchTerm}</strong>
            </p>
        </div>
    );
};


export default App;
