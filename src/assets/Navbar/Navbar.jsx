import './Navbar.css'

export default function Navbar() {
    return (
      <>
      
      <div className="header">
        <div className="name">
        <h2>Hello </h2>
        <h2>Priyanshu</h2>
        </div>
        <input type="search" name="" id="search" className='search-box' />
        <button className='search-btn' >Search</button>
        <p className="logout" >Log Out</p>
       
      </div>
       
      </>
    )
  }
  