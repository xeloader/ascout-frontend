import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useKey } from 'react-use'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { sv } from 'date-fns/locale'

const Fill = styled.div`
  display: flex;
  flex-direction: column;
  fill: 1;
  width: 100%;
  border: 5px solid black;
  align-items: center;
`
const CropSquare = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  background-position: center center;
  background-size: cover;
  background-image: url('${props => props.src}');
`

const Content = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
`

const UpdatedAt = styled.p`
  margin: 0;
  color: gray;
  font-size: x-small;
  margin-bottom: 1rem;
`

const NavBar = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  justify-content: center;

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

const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-column-gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const Link = styled.a``

const Description = styled.p`
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  overflow: hidden;
  text-align: left;
  background-color: white;
  margin: 0;
`

const GridItem = styled.div`
  overflow: hidden;
  position: relative;
`

const NavWrapper = styled.nav`
  text-align: center;
`

const Subtitle = styled.p`
  color: gray;
`

const Header = styled.header`
  text-align: center;
`

function App () {
  const [items, setItems] = useState([])
  const [searchItems, setSearchItems] = useState()
  const [updatedAt, setUpdatedAt] = useState()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState()
  const [perPage, setPerPage] = useState(50)
  const [searchStr, setSearchStr] = useState('')
  const itemSource = searchItems || items
  const [indexStart, indexEnd] = [page * perPage, (page + 1) * perPage]
  const viewItems = itemSource.slice(indexStart, indexEnd)
  const nPages = Math.ceil(itemSource.length / perPage)

  const noSearchResults = !loading && viewItems.length === 0 && searchStr !== ''
  const noItemsReceived = !loading && viewItems.length === 0 && searchStr === ''
  const handleSearch = (e) => setSearchStr(e.target.value)

  const Pages = () =>
    <NavBar>
      {[...Array(nPages).keys()].map((_, i) => {
        const isActive = i === page
        const className = isActive
          ? 'active'
          : null
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

  useKey('ArrowLeft', () => setPage(page => page - 1))
  useKey('ArrowRight', () => setPage(page => page + 1))

  useEffect(() => {
    setLoading(true)
    axios.get('/assets/latest.json')
      .then((res) => {
        const { items = [], updatedAt } = res.data
        setUpdatedAt(updatedAt)
        setItems(items)
      })
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => {
    setPage(0)
    if (searchStr !== '') {
      const searchResult = items.filter((item) => {
        const haystackStr = JSON.stringify(item).toLowerCase()
        return haystackStr.indexOf(searchStr.toLowerCase()) > -1
      })
      setSearchItems(searchResult)
    } else {
      setSearchItems(null)
    }
  }, [searchStr, items])
  const humanUpdatedAt = updatedAt && formatDistanceToNow(new Date(updatedAt), { locale: sv })
  return (
    <Fill>
      <Header>
        <h1>ASCOUT</h1>
        <Subtitle>Söker konkursauktioner på PSAuction, PNTrading, Budi, Units och NetAuktion. 🚀</Subtitle>
        <UpdatedAt>Uppdaterad för {humanUpdatedAt} sen</UpdatedAt>
      </Header>
      <NavWrapper>
        <input placeholder='vad letar du efter?' onChange={handleSearch} />
        <Pages />
      </NavWrapper>
      <Content>
        {noItemsReceived && <p>No items for today</p>}
        {noSearchResults && <p>No matches</p>}
        {loading && <p>Loading items from auctions..</p>}
        <Grid>
          {viewItems.map((item, i) => (
            <GridItem key={i}>
              <Link href={item.link} target='_blank' rel='noopener noreferrer'>
                <CropSquare src={item.image} />
                <Description>{item.title}</Description>

              </Link>
            </GridItem>
          ))}
        </Grid>
      </Content>
      <Pages />
    </Fill>
  )
}

export default App
