# Loads the ABM library
import ABM

#Sets the size of the window
WIDTH = 600
HEIGHT = 600

# Create a new simulation of grid size 80 X 80 cells
# Set the verable in each cell of as "live"
world = ABM.World(80, ["resource"],[0])
world.setCell(35, 35, "resource", 1000)
world.update()



# This function "update" is run every iter ation by the ABM simulation
def update():
    world.diffuse("resource",0.5)
    world.update()
    #Draw the world with squares that have their "live" veriable set to 1
    ABM.draw(screen, world, "resource", 1,discreet=False)

    # Uncomment the line below to output number of live cells
    # print((world.countAll("live",1),0))

#Start the simulation
ABM.go()