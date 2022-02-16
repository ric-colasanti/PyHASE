import pgzrun
import pygame
import time
class Cell:
    t_now = 0
    t_next = 1

    @staticmethod
    def update():
        Cell.t_now, Cell.t_next = Cell.t_next, Cell.t_now

    def __init__(self,x_pos,y_pos,states):
        self.neighbours = []
        self.x_pos = x_pos
        self.y_pos = y_pos
        self.occupants = [None,None]
        self.number_neighbours =0
        self.states=[{},{}]
        for state in states:
            self.states[0][state]=""
            self.states[1][state]=""

    def setState(self,state,value):
        self.states[Cell.t_next][state]=value

    def getState(self,state):
        return self.states[Cell.t_now][state]

    def isState(self,state,value):
        return self.states[Cell.t_now][state]==value

    def addNeighbour(self,cell):
      self.neighbours.append(cell)
      self.number_neighbours+=1



    def addOccupant(self,occupant):
      self.occupants[Cell.t_now]=occupant
      self.occupants[Cell.t_next]=occupant

    def count(self,state,value):
        count = 0
        for cell in self.neighbours:
            if cell.states[Cell.t_now][state]==value:
                count+=1
        return count

class World:
    frame = 0.01
    def __init__(self,size,states):
        self.size = size
        self.cells=[]
        for i in range(self.size*self.size):
            self.cells.append(Cell((i%self.size),int(i/self.size),states))
        for cell in self.cells:
            for  y in range(cell.y_pos-1,cell.y_pos+2):
                for  x in range(cell.x_pos-1,cell.x_pos+2):
                    x=self.bounds(x)
                    y=self.bounds(y)
                    if (cell.x_pos!=x) or (cell.y_pos!=y):
                        pos = y*self.size+x
                        cell.addNeighbour(self.cells[pos])

    def setCell(self,x,y,state,value):
        pos = y*self.size+x
        self.cells[pos].setState(state,value)

    def getCell(self,x,y):
        pos = y*self.size+x
        return self.cells[pos]

    def countAll(self,state,value):
        count=0
        for cell in self.cells:
            if cell.isState(state,value):
                count+=1
        return count

    def update(self):
        Cell.update()

    def bounds(self,i):
        if i<0:
            return self.size + i
        if i>=self.size:
            return i-self.size
        return i

def go():
    pgzrun.go()
def draw(screen,world,state,value):
    pygame.display.set_caption('ABM')
    time.sleep(World.frame)
    width = screen.surface.get_width()
    height = screen.surface.get_height()
    ratio = width/world.size
    box_size = int(ratio-1)

    screen.fill((60, 60, 80))
    for cell in world.cells:
        if cell.isState(state,value):
            x_pos = int(cell.x_pos*ratio)
            y_pos = int(cell.y_pos*ratio)
            box = pygame.Rect((x_pos,y_pos),(box_size,box_size))
            #screen.draw.filled_circle((x_pos,y_pos),int(ratio/2),(60,200,60))
            screen.draw.filled_rect(box,(60,200,60))