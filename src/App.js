import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const Fill = styled.div`
  display: flex;
  flex-direction: column;
  fill: 1;
  width: 100%;
  border: 5px solid black;
  align-items: center;
`

const Thumbnail = styled.img`
  max-width: 256px;
  height: auto;
`

const NavBar = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;

  & > li {
    padding: 0.5rem;
    cursor: pointer;
    color: blue;
    text-decoration: underline;
    &.active {
      color: black;
    }
  }
`

const NavWrapper = styled.nav`
  text-align: center;
`

function App () {
  const [items, setItems] = useState([])
  const [searchItems, setSearchItems] = useState()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState()
  const [perPage, setPerPage] = useState(50)
  const [searchStr, setSearchStr] = useState('')
  const itemSource = searchItems || items
  const [indexStart, indexEnd] = [page * perPage, (page + 1) * perPage]
  const viewItems = itemSource.slice(indexStart, indexEnd)
  const nPages = parseInt(itemSource.length / perPage)
  const handleSearch = (e) => setSearchStr(e.target.value)
  useEffect(() => {
    const today = new Date()
    const assetId = '' + today.getFullYear() + today.getMonth() + today.getDate()
    setLoading(true)
    axios.get(`/assets/${assetId}.json`)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => {
    if (searchStr !== '') {
      const searchResult = items.filter((item) => {
        const title = item.title.toLowerCase()
        return title.indexOf(searchStr.toLowerCase()) > -1
      })
      setSearchItems(searchResult)
    } else {
      setSearchItems(null)
    }
  }, [searchStr, items])
  return (
    <Fill>
      <header>
        <h1>ASCOUT</h1>
        <p>{searchStr}</p>
      </header>
      <NavWrapper>
        <input placeholder='vad letar du efter?' onChange={handleSearch} />
        <br />
        <br />
        <label htmlFor='perPage'>Per sida</label>
        <select name='perPage'>
          <option>50</option>
        </select>
        <NavBar>
          {[...Array(nPages).keys()].map((_, i) => {
            const isActive = i === page
            const className = isActive && 'active'
            const display = i + 1
            return (
              <li
                onClick={() => setPage(i)}
                className={className}
                key={i}
              >{display}
              </li>
            )
          })}
        </NavBar>
      </NavWrapper>
      <main>
        {loading && <p>Loading items from auctions..</p>}
        {viewItems.map((item, i) => (
          <div key={i}>
            <a href={item.link}>
              <p>{item.title}</p>
              <Thumbnail src={item.image} />
            </a>
          </div>
        ))}
      </main>
    </Fill>
  )
}

export default App
