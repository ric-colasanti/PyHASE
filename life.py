import ABM
WIDTH = 600
HEIGHT = 600

world = ABM.World(80, ["live"])
world.setCell(35, 34, "live", 1)
world.setCell(35, 35, "live", 1)
world.setCell(35, 36, "live", 1)
world.setCell(34, 35, "live", 1)
world.setCell(36, 36, "live", 1)
world.update()

def update():
    for cell in world.cells:
        count = cell.count("live", 1)
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
    ABM.draw(screen, world, "live", 1)
    world.update()
    # print((world.countAll("live",1),0))

ABM.go()