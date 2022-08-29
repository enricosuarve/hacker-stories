import * as React from "react";

const welcome = {
    greeting: 'Hey',
    title: 'React',
};

const initialStories = [
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


const getAsyncStories = () =>
    new Promise((resolve) =>
        setTimeout(
            () => resolve({data: {stories: initialStories}}),
            2000
        )
    );


const getTitle = (title) => {
    console.log('getting title');
    return title;
}


const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue]

}

const App = () => {
    console.log('App renders');
    const [searchTerm, setSearchTerm] = useStorageState('search', '');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const [stories, setStories] = React.useState([]);

    React.useEffect(() => {
        setIsLoading(true)
        getAsyncStories().then(result => {
            setStories(result.data.stories);
            setIsLoading(false);
        })
            .catch(()=>setIsError(true));
    }, []);

    const searchedStories = stories.filter(function (story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleRemoveStory = (item) => {
        const newStories = stories.filter(
            (story) => item.objectID !== story.objectID
        );
        setStories(newStories)
    }

    return (
        <div>
            <h1>
                {welcome.greeting} {welcome.title}<br/>
                Hello {getTitle('React')}
            </h1>
            <h2>
                {isLoading ? "Loading..." : undefined}
                {isError && <p>Something went wrong...</p>}
            </h2>
            <InputWithLabel
                id="search"
                value={searchTerm}
                onInputChange={handleSearch}
                isFocused
            >
                Search:
            </InputWithLabel>
            <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
        </div>
    );
}


const InputWithLabel = ({id, value, onInputChange, type = 'text', children, isFocused}) => {
    //A
    const inputRef = React.useRef();

    //C
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            //D
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            {/*B*/}
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={onInputChange}
            />
        </>
    );
}

const List = ({list, onRemoveItem}) => (
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
            />
        ))}
    </ul>
)


const Item = ({item, onRemoveItem}) => {
    const handleRemoveItem = () => {
        onRemoveItem(item);
    }
    return (
        <>
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
            <span>
                <button type="button" onClick={handleRemoveItem}>
                    Dismiss
                </button>
            </span>
        </>
    );
}

export default App;
