import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Users from './User';

const SearchPage = (props) => {
  const [input, setInput] = useState('');
  const [usersListDefault, setUsersListDefault] = useState();
  const [usersList, setUsersList] = useState();

  const fetchData = async () => {
    return await fetch('https://restcountries.eu/rest/v2/all')
      .then(response => response.json())
      .then(data => {
         setUsersList(data) 
         setUsersListDefault(data)
       });}

  const updateInput = async (input) => {
     const filtered = usersListDefault.filter(users => {
      return users.name.toLowerCase().includes(input.toLowerCase())
     })
     setInput(input);
     setUsersList(filtered);
  }

  useEffect( () => {fetchData()},[]);
	
  return (
    <>
      <h1>User</h1>
      <SearchBar 
       input={input} 
       onChange={updateInput}
      />
      <Users usersList={usersList}/>
    </>
   );
}

export default SearchPage