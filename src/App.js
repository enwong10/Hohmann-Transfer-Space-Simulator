import React, { Component } from 'react';
import './App.css';

export class App extends Component {
  constructor() {
    super()
    this.canvasRef = React.createRef();
    this.initialDate = new Date(2020, 0, 1);
    this.initialPos = [(3 / 2) * Math.PI - 0.2, 0, Math.PI / 2 + 0.2, (5 / 4) * Math.PI, (3 / 2) * Math.PI, (3 / 2) * Math.PI + 0.4, Math.PI / 4, -0.2];
    this.planetPos = [...this.initialPos];
    this.planetInterval = [(2 * Math.PI) / 88, (2 * Math.PI) / 225, (2 * Math.PI) / 365, (2 * Math.PI) / 687, (2 * Math.PI) / (12 * 365), (2 * Math.PI) / (29 * 365), (2 * Math.PI) / (84 * 365), (2 * Math.PI) / (165 * 365)];
    this.planetOrbitRad = [25, 40, 55, 70, 150, 190, 230, 270];
    this.planetOrbitTime = [88, 225, 365, 687, 12 * 365, 29 * 365, 84 * 365, 165 * 365]
    this.planetOrbitRadiusActual = [58 * Math.pow(10, 6), 108 * Math.pow(10, 6), 150 * Math.pow(10, 6), 228 * Math.pow(10, 6), 779 * Math.pow(10, 6), 1434 * Math.pow(10, 6), 2873 * Math.pow(10, 6), 4495 * Math.pow(10, 6)];
    this.GM = 1.327 * Math.pow(10, 11);
    this.destination = 0;

    this.flightSemiMajor = 0;
    this.flightSemiMinor = 0;
    this.flightTime = 0;
    this.flightPos = 0;
    this.flightEntranceVel = 0;
    this.flightExitVel = 0;

    this.flightDaysElapsed = 0;
    this.flightArrivalDay = 0;

    this.state = {
      daysElapsed: 0,
      height: window.innerHeight,
      width: window.innerWidth * 0.75,
      isSimulating: false,
      readyToLaunch: false,
      skip: false
    }

    this.redraw = this.redraw.bind(this);
    this.simulate = this.simulate.bind(this);
    this.skip = this.skip.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({
        height: window.innerHeight,
        width: window.innerWidth * 0.75
      });
      this.redraw();
    });

    this.redraw();
  }

  redraw() {
    let ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    this.drawOutline();
    this.drawPlanets();
  }

  drawOutline() {
    let ctx = this.canvasRef.current.getContext("2d");

    //SUN
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow"
    ctx.fill();
    ctx.closePath();

    //MERCURY
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 25, 0, 2 * Math.PI);
    ctx.strokeStyle = "orange";
    ctx.stroke();
    ctx.closePath();

    //VENUS
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 40, 0, 2 * Math.PI);
    ctx.strokeStyle = "#eb6e6e";
    ctx.stroke();
    ctx.closePath();

    //EARTH
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 55, 0, 2 * Math.PI);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.closePath();

    //MARS
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 70, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

    //JUPITER
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 150, 0, 2 * Math.PI);
    ctx.strokeStyle = "pink";
    ctx.stroke();
    ctx.closePath();

    //SATURN
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 190, 0, 2 * Math.PI);
    ctx.strokeStyle = "magenta";
    ctx.stroke();
    ctx.closePath();

    //URANUS
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 230, 0, 2 * Math.PI);
    ctx.strokeStyle = "turquoise";
    ctx.stroke();
    ctx.closePath();

    //NEPTUNE
    ctx.beginPath();
    ctx.arc(this.state.width / 2, this.state.height / 2, 270, 0, 2 * Math.PI);
    ctx.strokeStyle = "#6aa3e6";
    ctx.stroke();
    ctx.closePath();
  }

  drawPlanets() {
    let ctx = this.canvasRef.current.getContext("2d");

    //MERCURY
    ctx.beginPath();
    let [x, y] = this.getPlanetCoords(0);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "orange"
    ctx.fill();
    ctx.closePath();

    //VENUS
    ctx.beginPath();
    [x, y] = this.getPlanetCoords(1);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#eb6e6e"
    ctx.fill();
    ctx.closePath();

    //EARTH
    ctx.beginPath();
    [x, y] = this.getPlanetCoords(2);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "blue"
    ctx.fill();
    ctx.closePath();

    //MARS
    ctx.beginPath();
    [x, y] = this.getPlanetCoords(3);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red"
    ctx.fill();
    ctx.closePath();

    //JUPITER
    ctx.beginPath();
    [x, y] = this.getPlanetCoords(4);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "pink"
    ctx.fill();
    ctx.closePath();

    //SATURN
    ctx.beginPath();
    [x, y] = this.getPlanetCoords(5);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "magenta"
    ctx.fill();
    ctx.closePath();

    //URANUS
    ctx.beginPath();
    [x, y] = this.getPlanetCoords(6);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "turquoise"
    ctx.fill();
    ctx.closePath();

    //NEPTUNE
    ctx.beginPath();
    [x, y] = this.getPlanetCoords(7);
    ctx.arc(this.state.width / 2 + x, this.state.height / 2 - y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#6aa3e6"
    ctx.fill();
    ctx.closePath();
  }

  drawFlightPath() {
    let ctx = this.canvasRef.current.getContext("2d");

    ctx.beginPath();
    let midpointX = (this.planetOrbitRad[2] * Math.cos(this.flightPos) + this.planetOrbitRad[this.destination] * Math.cos(this.flightPos + Math.PI)) / 2
    let midpointY = (this.planetOrbitRad[2] * Math.sin(this.flightPos) + this.planetOrbitRad[this.destination] * Math.sin(this.flightPos + Math.PI)) / 2

    ctx.ellipse(this.state.width / 2 + midpointX, this.state.height / 2 - midpointY, this.flightSemiMajor, this.flightSemiMinor, -this.flightPos, 0, -this.flightDaysElapsed * Math.PI / this.flightTime, true)
    ctx.strokeStyle = "white"
    ctx.stroke();
    ctx.closePath();
  }

  getPlanetCoords(planetIndex) {
    let x = this.planetOrbitRad[planetIndex] * Math.cos(this.planetPos[planetIndex])
    let y = this.planetOrbitRad[planetIndex] * Math.sin(this.planetPos[planetIndex])
    this.planetPos[planetIndex] = this.planetPos[planetIndex] + this.planetInterval[planetIndex];
    return [x, y]
  }

  simulate() {
    this.flightDaysElapsed = 0;

    this.setState({
      isSimulating: true
    })
    if (!this.readyToLaunch) {
      this.calculateFlightPath();
    }
    this.checkNextDay();
  }

  calculateFlightPath() {
    let semiMajorAxisActual = (this.planetOrbitRadiusActual[2] + this.planetOrbitRadiusActual[this.destination]) / 2
    this.flightTime = Math.sqrt(Math.pow(Math.PI, 2) * Math.pow(semiMajorAxisActual, 3) / this.GM) / (60 * 60 * 24)

    this.flightExitVel = (Math.sqrt(this.GM / this.planetOrbitRadiusActual[2])) * ((Math.sqrt(2 * this.planetOrbitRadiusActual[2] / (this.planetOrbitRadiusActual[2] + this.planetOrbitRadiusActual[this.destination]))) - 1)
    this.flightEntranceVel = (Math.sqrt(this.GM / this.planetOrbitRadiusActual[this.destination])) * (1 - (Math.sqrt(2 * this.planetOrbitRadiusActual[this.destination] / (this.planetOrbitRadiusActual[2] + this.planetOrbitRadiusActual[this.destination]))))

    this.flightSemiMajor = (this.planetOrbitRad[2] + this.planetOrbitRad[this.destination]) / 2
    let eccentricity = (this.flightSemiMajor - this.planetOrbitRad[2]) / this.flightSemiMajor;
    this.flightSemiMinor = this.flightSemiMajor * (Math.sqrt(1 - Math.pow(eccentricity, 2)));
  }

  checkNextDay() {
    if (!this.state.skip) {
      setTimeout(() => {
        this.setState((prevState) => {
          return { daysElapsed: prevState.daysElapsed + 1 }
        }, () => {

          this.redraw();

          if (this.state.readyToLaunch) {
            this.flightDaysElapsed++;
            this.drawFlightPath();
          }

          if ((this.state.readyToLaunch && this.state.daysElapsed < this.flightArrivalDay) || (!this.state.readyToLaunch && (Math.abs(this.flightTime % this.planetOrbitTime[this.destination] - this.checkLaunch()) > 1))) {
            this.checkNextDay();
          }
          else {
            this.setState((prevState) => {
              return {
                isSimulating: false,
                readyToLaunch: !prevState.readyToLaunch,
                skip: false
              }
            })
            this.flightArrivalDay = this.state.daysElapsed + Math.ceil(this.flightTime);
            this.flightPos = this.planetPos[2];
          }
        })
      }, 500)
    }
    else if (!this.state.readyToLaunch) {
      let daysElapsed = 0;
      while (Math.abs(this.flightTime % this.planetOrbitTime[this.destination] - this.checkLaunch()) > 1) {
        daysElapsed++;
        this.planetPos[2] = this.planetPos[2] + this.planetInterval[2];
        this.planetPos[this.destination] = this.planetPos[this.destination] + this.planetInterval[this.destination];
      }

      this.setState((prevState) => {
        return {
          daysElapsed: prevState.daysElapsed + daysElapsed,
          isSimulating: false,
          readyToLaunch: true,
          skip: false
        }
      }, () => {

        for (let i = 0; i < this.planetPos.length; i++) {
          this.planetPos[i] = this.initialPos[i] + this.state.daysElapsed * this.planetInterval[i];
        }

        this.redraw();


        this.flightArrivalDay = this.state.daysElapsed + Math.ceil(this.flightTime);
        this.flightPos = this.planetPos[2];
      });
    }
    else {
      this.setState((prevState) => {
        return {
          daysElapsed: this.flightArrivalDay,
          isSimulating: false,
          readyToLaunch: false,
          skip: false
        }
      }, () => {
        for (let i = 0; i < this.planetPos.length; i++) {
          this.planetPos[i] = this.initialPos[i] + this.state.daysElapsed * this.planetInterval[i];
        }

        this.flightDaysElapsed = this.flightTime;
        this.redraw();
        this.drawFlightPath();
      });
    }
  }

  checkLaunch() {
    let angleDiff = (this.planetPos[2] + Math.PI) % (2 * Math.PI) - this.planetPos[this.destination] % (2 * Math.PI)
    if (angleDiff < 0) {
      angleDiff = angleDiff + 2 * Math.PI;
    }
    return angleDiff / this.planetInterval[this.destination];
  }

  skip() {
    this.setState({
      skip: true
    })
  }

  reset() {
    this.setState({
      daysElapsed: 0,
      isSimulating: false,
      readyToLaunch: false,
      skip: false
    }, () => {

      this.planetPos = [...this.initialPos];
  
      this.flightSemiMajor = 0;
      this.flightSemiMinor = 0;
      this.flightTime = 0;
      this.flightPos = 0;
      this.flightEntranceVel = 0;
      this.flightExitVel = 0;
  
      this.flightDaysElapsed = 0;
      this.flightArrivalDay = 0;

      this.redraw();
    });
  }

  render() {
    return (
      <div className="App">
        <canvas ref={this.canvasRef} height={this.state.height} width={this.state.width}> </canvas>
        <div className="Sidebar">
        <h3> Hohmann Transfer Orbit Flight Simulator </h3>
          Date:
          <span style={{color: "#919090", marginLeft: "15px"}}>
          {new Date(this.initialDate.getTime() + 1000 * 60 * 60 * 24 * this.state.daysElapsed).toDateString()}
          </span>
          <br />
          Destination:
          <select name="destination" id="destination" onChange={(event) => (this.destination = event.currentTarget.value)}>
            <option value="0">Mercury</option>
            <option value="1">Venus</option>
            <option value="3">Mars</option>
            <option value="4">Jupiter</option>
            <option value="5">Saturn</option>
            <option value="6">Uranus</option>
            <option value="7">Neptune</option>
          </select>
          <br />
          {!this.state.readyToLaunch ?
            <div>
              <br />
              {!this.state.isSimulating ?
                <div>
                  <button onClick={this.simulate} style={{borderColor: "#043800"}}> Find Launch Date! </button>
                  <button onClick={this.reset} style={{borderColor: "#450000"}}> Reset </button>
                  </div> :
                <div>
                  {!this.state.skip ? <button onClick={this.skip}> Skip </button> : "Simulating..."}
                </div>}
            </div> :
            <div>
              <br/>
              Flight Details: 
              <p style={{fontSize: "medium"}}>
                Flight Time: {Math.ceil(this.flightTime)} days
                <br />
                Exit Velocity: {Math.round(this.flightExitVel)} km/s
                <br />
                Entrance Velocity: {Math.round(this.flightEntranceVel)} km/s
              </p>
              <br/>
              {!this.state.isSimulating ? 
              <div>
                <button onClick={this.simulate} style={{borderColor: "#043800"}}> Launch! </button> 
                <button onClick={this.reset} style={{borderColor: "#450000"}}> Reset </button>
              </div>:
                <button onClick={this.skip}> Skip </button>
              }
            </div>}
        </div>
      </div>
    );
  }
}

export default App;
