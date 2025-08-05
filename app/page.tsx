import NavBar from "../components/ui/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar />
      
      <div className="container">
        <div className="section">
          <h1 className="title">Welcome to ALUFFM Dashboard</h1>
          <p className="subtitle">Your comprehensive dashboard for managing ads and analytics.</p>
        </div>
      </div>
    </div>
  )
}
