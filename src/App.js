import * as React from "react";
import axios from "axios";

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
    const [url, setUrl] = React.useState(
        `${API_ENDPOINT}${searchTerm}`
    );
    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault();
    };


    const handleFetchStories = React.useCallback(async () => {
        if (!searchTerm) return;
        dispatchStories({type: 'STORIES_FETCH_INIT'});

        try {
            const result = await axios.get(url);

            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({type: 'STORIES_FETCH_FAILURE'});
        }
        //
        // .catch(() =>
        //     dispatchStories({type: 'STORIES_FETCH_FAILURE',})
        // );
    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

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
            <SearchForm onSearchInput={handleSearchInput}
                        onSearchSubmit={handleSearchSubmit}
                        searchTerm={searchTerm}
            />
            <List list={stories.data} onRemoveItem={handleRemoveStory}/>
        </div>
    );
}

const SearchForm =({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
})=>
    (  <form onSubmit={onSearchSubmit}>
        <InputWithLabel
            id="search"
            value={searchTerm}
            onInputChange={onSearchInput}
            isFocused
        >
            Search:
        </InputWithLabel>
        <button type="submit" disabled={!searchTerm}>
            Get Some
        </button>

    </form>);
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
