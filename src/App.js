import React,{useState,useEffect} from 'react';
import './App.css';
import MovieBox from './MovieBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar,Container,Nav,Form, FormControl,Button } from 'react-bootstrap';

const API_URL="https://api.themoviedb.org/3/movie/popular?api_key=06c65a13fda2313a1aa66962113f3a6f";
const API_SEARCH="https://api.themoviedb.org/3/search/movie?api_key=06c65a13fda2313a1aa66962113f3a6f&query";
function App() {

  const [movies, setMovies]=useState([]);
  const [filterdMovies, setfilterdMovies] = useState(null)
  const [query, setQuery]=useState('');
  const [isFiltered, setisFiltered] = useState(false)
  //const [hasDateFiltration, sethasDateFiltration] = useState(false)
  //const [hasGenreFiltration, sethasGenreFiltration] = useState(false)
  

  //FETCH TRENDING MOVIES ON LOAD
  useEffect(() => {
    fetch(API_URL)
    .then((res)=>res.json())
    .then(data=>{
      console.log(data);
      setMovies(data.results);
    })
  }, [])

  //FILTER FUNCTTION BY GENRE
  //THE filter PARAM IS PROVIDED WHEN CALLED
  //BASED ON THE GENRE CODES AVAILABLE FROM THE API SITE
  const filterFunc = (filter) => {

      const Movies = movies.filter((movie) => movie?.genre_ids?.includes(filter));
      setfilterdMovies(Movies);
      setisFiltered(true);
      // sethasGenreFiltration(true) 
      // sethasDateFiltration(false)
  }

  //FILTER BY RELEASE DATE
    const filterDate = (date) => {
      
      const Movies = movies.filter((movie) => Number(movie?.release_date.slice(0, 4)) === date)
      setfilterdMovies(Movies);
    }

  //SEARCH API CALL
  const searchMovie = async(e)=>{
    e.preventDefault();
    console.log("Searching");
    try{
      const url=`https://api.themoviedb.org/3/search/movie?api_key=06c65a13fda2313a1aa66962113f3a6f&query=${query}`;
      const res= await fetch(url);
      const data= await res.json();
      console.log(data);
      setMovies(data.results);
      setfilterdMovies(data.results); 
    }
    catch(e){
      console.log(e);
    }
  }

  //SETS THE SEARCH VALUE
  const changeHandler=(e)=>{
    setQuery(e.target.value);
  }
  return (
    <>
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand id='logo' href="/home">UptickMovie</Navbar.Brand>
        {/* <Navbar.Brand href="/home">Trending Movies</Navbar.Brand> */}
        
        <Navbar.Toggle aria-controls="navbarScroll"></Navbar.Toggle>

          <Navbar.Collapse id="nabarScroll">
            <Nav 
            className="me-auto my-2 my-lg-3"
            style={{maxHeight:'100px'}}
            navbarScroll></Nav>

            <Form className="d-flex" onSubmit={searchMovie} autoComplete="off">
              <FormControl
              type="search"
              placeholder="Movie Search"
              className="me-2"
              aria-label="search"
              name="query"
              value={query} onChange={changeHandler}></FormControl>
              <Button variant="secondary" type="submit">Search</Button>
            </Form>
          </Navbar.Collapse>
      </Container>
      <Navbar.Brand className='filter'>
              <h6>Filter by Genre</h6>
              <div>
                <label htmlFor="Action">Action</label>
                {/* 28 is the genre code for Action */}
                <input  onChange={()=> filterFunc(28) } id='Action' type="radio" name='filter'></input>
              </div>
              <div>
                <label htmlFor="Crime">Crime</label>
                <input onChange={()=> filterFunc(80) } id='Crime' type="radio" name='filter'></input>
              </div>
              <div>
                <label htmlFor="Thriller">Thriller</label>
                <input  onChange={()=> filterFunc(53)} id='Thriller' type="radio" name='filter'></input>
              </div>
              <div>
                <label htmlFor="Horror">Horror</label>
                <input onChange={()=> filterFunc(99)} id='Horror' type="radio" name='filter'></input>
                </div>
                <div>
                <label htmlFor="Horror">2023 Movies</label>
                <input onChange={()=> filterDate(2023)} name='filter' id='2023' type="radio"></input>
                </div>
                  {/* <label >2023</label>
                 
                  <label  >2015-2022</label>
                  <input onChange={()=> filterDate(2022)} name='date' id='2015-2022' type="radio"></input>
                  <label  >&#60;2015</label>
                  <input onChange={()=> filterDate(2021)}name='date' id='<2015' type="radio"></input> */}
              </Navbar.Brand>
    </Navbar>
    
    <div>
    <div id='trending' href="/home">Trending Movies</div>
      {(movies.length > 0 ) ?(
        <div className="container">
        <div className="grid">

              { 
                !isFiltered ?
                movies.map((movieReq)=>
              <MovieBox key={movieReq.id} {...movieReq}/>) 
              : 
              ( filterdMovies.length > 0 ?
              filterdMovies.map((movieReq)=>
              <MovieBox key={movieReq.id} {...movieReq}/>) 
              : (<div> <h2>Sorry !! No Movies Found</h2></div>)
              )
              }

        </div>
    </div>
      ):(
        <h2>Sorry !! No Movies Found</h2>
      )}
    </div>   
    </>
   
  );
}

export default App;
