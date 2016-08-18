# shiny
Make something shiny they said...

[Live version here](dustin.raimondi.rocks/shiny)

Varibles you can play with from in the source or from the console:
```
maxNodeCount: 50 - controls length of line
backgroundColor: "#202520"
logFPS: false - enabling reduces fps...

lineColor: "#00FF00" - use null for random color!
particleColor: null - use null for random colors!

particlesPerFrame: 2
bloomMultiplier: 2

particleMaxVelocityLeft: 40 
particleMaxVelocityRight: 40 
particleMaxVelocityUp: 40 
particleMaxVelocityDown: 40 

lineWidth: 0.75

particleMaxAge: 100 - maximum age of particles in frames
particleMinAge: 10 - minimum age of particles in frames

particleMaxSize: 2
particleMinSize: 1

maxFPS: 60 - not tested above 60, my 144hz monitor is back in NY
minFPS: 12 - minimum desired FPS
