# Loads the ABM library
import ABM

#Sets the size of the window
WIDTH = 600
HEIGHT = 600

# Create a new simulation of grid size 80 X 80 cells
# Set the variable in each cell of as "resource" and set value to 0
#world = ABM.World(30, ["resource"],["rnd"])
world = ABM.World(30, ["state"],[0],n_type=4)
#set center cell resource to 500
#add agent to top lefthand corner
world.addAgent(1,1)
world.setState(1, 1, "state", 1)
world.update()



# This function "update" is run every iteration by the ABM simulation
def update():
    #sleep
    ABM.frame = 0.1
    

    # loop through all agents
    for agent in world.agents:
        # move agent to best local value of variable "resource"
        agent.right()
        #agent.moveRandom()

    world.update()
    #Draw the world with squares that have their "live" variable set to 1
    ABM.draw(screen, world, "state", 1,discreet=True)


    # Uncomment the line below to output total resource
    #print((world.sumAll("resource"),0))

#Start the simulation
ABM.go()