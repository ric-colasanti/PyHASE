# Loads the ABM library
import ABM

#Sets the size of the window
WIDTH = 600
HEIGHT = 600

# Create a new simulation of grid size 80 X 80 cells
# Set the variable in each cell of as "resource" and set value to 0
#world = ABM.World(30, ["resource"],["rnd"])
world = ABM.World(120, ["state"],[0],n_type=4)

world.addAgent(60,60,color='red')



# This function "update" is run every iteration by the ABM simulation
def update():
    #sleep
    ABM.frame = 0.001


    # loop through all agents
    for agent in world.agents:
        # move agent to best local value of variable "resource"
        state = agent.getState("state")
        if state == 1:
            agent.setState("state",0)
            agent.right()
        else:
            agent.setState("state",1)
            agent.left()
        #agent.moveRandom()

    #Draw the world with squares that have their "live" variable set to 1
    ABM.draw(screen, world, "state", 1,discreet=True)


#Start the simulation
ABM.go()
