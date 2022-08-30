import * as React from "react";

const welcome = {
    greeting: 'Hey',
    title: 'React',
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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

const storiesReducer = (state, action) => {
    switch (action.type) {
        case'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case'STORIES_FETCH_SUCCESS' :
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,

            }
        case'STORIES_FETCH_FAILURE' :
            return {
                ...state,
                isLoading: false,
                isError: true,
            }
        case'REMOVE_STORY' :
            return {
                ...state,
                date: state.data.filter(
                    (story) => action.payload.objectID !== story.objectID
                ),
            };
        default:
            throw new Error();
    }
};

const App = () => {
    console.log('App renders');
    const [searchTerm, setSearchTerm] = useStorageState('search', 'react');
    const [stories, dispatchStories] = React.useReducer(storiesReducer,
        {data: [], isLoading: false, isError: false}
    );
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };


    // A
    const handleFetchStories = React.useCallback(() => { // B
        if (!searchTerm) return;
        dispatchStories({type: 'STORIES_FETCH_INIT'});

        fetch(`${API_ENDPOINT}${searchTerm}`)
            .then((response) => response.json())
            .then(result => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.hits,
                });
            })
            .catch(() =>
                dispatchStories({type: 'STORIES_FETCH_FAILURE',})
            );
    }, [searchTerm]); // E

    React.useEffect(() => {
        handleFetchStories(); // C
    }, [handleFetchStories]); // D

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    return (
        <div>
            <h1>
                {welcome.greeting} {welcome.title}<br/>
                Hello {getTitle('React')}
            </h1>
            <h2>
                {stories.isLoading ? "Loading..." : undefined}
                {stories.isError && <p>Something went wrong...</p>}
            </h2>
            <InputWithLabel
                id="search"
                value={searchTerm}
                onInputChange={handleSearch}
                isFocused
            >
                Search:
            </InputWithLabel>
            <List list={stories.data} onRemoveItem={handleRemoveStory}/>
        </div>
    );
}


const InputWithLabel = ({id, value, onInputChange, type = 'text', children, isFocused}) => {
    const inputRef = React.useRef();

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
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
