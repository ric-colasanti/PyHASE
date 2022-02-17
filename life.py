# Loads the ABM library
import ABM

#Sets the size of the window
WIDTH = 600
HEIGHT = 600

# Create a new simulation of grid size 80 X 80 cells
# Set the verable in each cell of as "live"
world = ABM.World(80, ["live"],[0])

# Set the live variable of an individual cell at the grid cordinate of 35 34  to 1
world.setCell(35, 34, "live", 1)
world.setCell(35, 35, "live", 1)
world.setCell(35, 36, "live", 1)
world.setCell(34, 35, "live", 1)
world.setCell(36, 36, "live", 1)
#Update the world
world.update()

# This function "update" is run every iter action by the ABM simulation
def update():
    #sleep
    ABM.frame = 0.01
    
    # For every cell in the simulation grid
    for cell in world.cells:
        # Count the number of imidiate neighbours that have their "live" veriable set to 1
        count = cell.count("live", 1)

        # The game of life rules
        if cell.isState("live", 1):
            if count == 2 or count == 3:
                cell.setState("live", 1)
            else:
                cell.setState("live", 0)
        else:
            if count == 3:
                cell.setState("live", 1)
            else:
                cell.setState("live", 0)
    #Update the world
    world.update()
    #Draw the world with squares that have their "live" veriable set to 1
    ABM.draw(screen, world, "live", 1,discreet=True)

    # Uncomment the line below to output number of live cells
    # print((world.countAll("live",1),0))

#Start the simulation
ABM.go()