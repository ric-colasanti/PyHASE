turtles-own[
  drinking-class ;; 3 types susceptible current former
]

globals [
  debug-turtle

  per-susceptible ;; % population susceptible to drinking
  per-current     ;; % population currently drinking
  per-former      ;; % population former drinkers

  iterations

  move-rate       ;; probability of moving
  prob-stop       ;; probability of stopping drinking
  prob-restart    ;; probability of re-starting drinking

  time-when-no-susceptible
  flag
]



to setup
  clear-patches
  clear-ticks
  clear-turtles
  clear-all-plots
  ;; clear all data and agents


  set-default-shape turtles "person"

  ask patches[
    if pycor = 1[  ;; only have center row of the matrix  populated with agents ( 1D mode;)
      sprout 1 [
        set size 1.5  ;; so agent looks visable on 1D ladscape
        set drinking-class "susceptible"  ;; set all agents as susceptible to drinking
      ]
    ]
  ]


  ask one-of turtles with [ drinking-class = "susceptible" ][
    set drinking-class "current"  ;; pick one of the susceptible agents as an inital drinker
  ]

  ;;; debugging
  debuging

  ask turtles [ set-color ] ;; set agent color to drinking state
  ask patches [ set pcolor black ] ;; bacground to black

  if add-bar[
    ask patch 50 0 [
      set pcolor orange
    ]
    ask patch 50 1 [
      set pcolor orange
    ]
    ask patch 50 2 [
      set pcolor orange
    ]
  ]


  set iterations 0


  ;; using switch to set one of tow options for move, re-starting drinking and stopping drinking
  ifelse move-more[  ;; values taken from paper
      set move-rate 0.5
  ][
      set move-rate 0.2
  ]

  ifelse high-probablity-of-quiting[  ;; values taken from paper
    set prob-stop 0.5
  ][
    set prob-stop 0.3
  ]

  ifelse high-probability-of-restarting [  ;; values taken from paper
    set prob-restart 0.5
  ][
    set prob-restart 0.3
  ]
  if  flag = 0 [
    output-print "move quiting restart current former time"
    set flag true
  ]

  reset-ticks
end

to set-color  ;; turtle procedure for setting color to drinking state
  (ifelse
  drinking-class = "susceptible" [
    set color green
  ]
  drinking-class = "current" [
    set color red
  ]
  drinking-class = "former" [
    set color blue
  ])

end

to move
  if random-float 1 < move-rate [ ;; test to see if move
    ;; randomly pick left or right
    ifelse random-float 1 < 0.5 [
      face patch-at -1 0  ;; x - 1   left
    ][
      face patch-at 1 0   ;; x + 1   right
     ]
    forward 1;; advance one step
  ]
end


to move-pub
  if random-float 1 < move-rate [ ;; test to see if move
    ;; randomly pick left or right
    let bias 0.5
    if xcor > 50[
      set bias 0.75
    ]
    if xcor < 50[
      set bias 0.25
    ]
    ifelse random-float 1 < bias [
      face patch-at -1 0  ;; x - 1   left
    ][
      face patch-at 1 0   ;; x + 1   right
     ]
    forward 1;; advance one step
  ]
end

to set-state
  let s count turtles-here with [ drinking-class = "susceptible" ]
  let d count turtles-here with [ drinking-class = "current" ]
  let r count turtles-here with [ drinking-class = "former" ]
  let t count turtles-here
  let t-class drinking-class
  (ifelse
    t-class = "susceptible" [
      if random-float 1 < d / t [
        set drinking-class "current"
      ]
    ]
    t-class = "current" [
      if random-float 1 < r / t + prob-stop[
        set drinking-class "former"
      ]
  ]
    t-class = "former" [
      if random-float 1 < d / t + prob-restart[
        set drinking-class "current"
      ]
  ])
end

to debuging
  if debug [
    set debug-turtle one-of turtles with [ drinking-class = "susceptible" ]
    ask debug-turtle [
      set color white
    ]
  ]
end

to go
  ask turtles [
    ifelse add-bar[
      ifelse drinking-class = "current"[
        move-pub
      ][
        move
      ]
    ][
    move
    ]
    set-state
    set-color
  ]

  set per-susceptible count turtles with [ drinking-class = "susceptible" ]
  set per-current count turtles with [ drinking-class = "current" ]
  set per-former count turtles with [ drinking-class = "former" ]
  debuging

  ask patches[
    if pycor = 1 [
    set plabel count turtles-here
    ]
  ]
  tick
  set iterations iterations + 1
  if count turtles with [ drinking-class = "susceptible" ] > 0 [
    set time-when-no-susceptible  iterations
  ]
  if iterations >= 1000 [

    output-type move-rate
    output-type "  "
    output-type prob-stop
    output-type "     "
    output-type prob-restart
    output-type "     "
    output-type per-current
    output-type "      "
    output-type per-former
    output-type "     "
    output-print time-when-no-susceptible
    stop
  ]
end



; Public Domain:
; To the extent possible under law, Ricardo Colasanti ( and UoG ? )has waived all
; copyright and related or neighboring rights to this model.
@#$#@#$#@
GRAPHICS-WINDOW
10
65
1518
119
-1
-1
15.0
1
8
1
1
1
0
1
0
1
0
99
0
2
1
1
1
ticks
30.0

BUTTON
20
375
110
408
NIL
setup
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

BUTTON
170
375
262
408
NIL
go
T
1
T
OBSERVER
NIL
NIL
NIL
NIL
0

SWITCH
1400
735
1503
768
debug
debug
1
1
-1000

TEXTBOX
55
20
1525
76
Agent-Based Modeling of Drinking Behavior: A Preliminary Model and Potential Applications to Theory and Practice
25
0.0
1

PLOT
355
130
735
375
Susceptible
Iterations days
% susceptible
0.0
1000.0
0.0
100.0
true
false
"" ""
PENS
"default" 1.0 0 -10899396 true "" "plot per-susceptible"

PLOT
755
130
1130
375
Current drinkers
iterations days
% current drinkers
0.0
1000.0
0.0
100.0
true
false
"" ""
PENS
"default" 1.0 0 -2674135 true "" "plot per-current"

PLOT
1140
130
1515
375
Former drinkers
iterations days
% former drinkers
0.0
1000.0
0.0
100.0
true
false
"" ""
PENS
"default" 1.0 0 -13345367 true "" "plot per-former"

TEXTBOX
355
380
505
398
Susceptible to drinking
12
55.0
1

TEXTBOX
760
380
910
398
Current drinker
12
15.0
1

TEXTBOX
1150
380
1300
398
Former drinker
12
105.0
1

TEXTBOX
15
125
335
145
Value shows number of people in a patch
12
0.0
1

SWITCH
20
155
260
188
move-more
move-more
1
1
-1000

SWITCH
20
205
260
238
high-probablity-of-quiting
high-probablity-of-quiting
0
1
-1000

SWITCH
20
255
262
288
high-probability-of-restarting
high-probability-of-restarting
1
1
-1000

MONITOR
755
395
930
440
% Current drinkers
per-current
17
1
11

MONITOR
1140
395
1315
440
% Former drinkers
per-former
17
1
11

MONITOR
350
395
527
440
% Susceptible non drinkers
per-susceptible
17
1
11

MONITOR
540
395
707
440
time when no susceptible
time-when-no-susceptible
17
1
11

OUTPUT
350
455
720
725
13

BUTTON
755
455
862
488
clear output
clear-output\nset flag 0
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

SWITCH
20
305
132
338
add-bar
add-bar
1
1
-1000

@#$#@#$#@
## WHAT IS IT?

A version of Gorman's mode from the paper "Agent-based modeling of drinking behavior: a preliminary model and potential applications to theory and practice"

## HOW IT WORKS

The ABM is an abstract spatially discrete model of drinking behavour. The environment is represented as a simple one-dimensional grid of spaces. People are represented as simple agents that can be in one of three drinking states: never-drank (green) , current-drinker (red), and former-drinker (blue). Each agent occupies an individual grid space and can move between adjacent spaces. Each space can contain any number of agents ( indicated by the number in the space). An agent’s state is influenced by its current state and the states of the other agents that occupy the same space.  

There are two versions of the model. In one, the agents move randomly between adjacent spaces. In the other, the agents also move randomly, but the agents who are current drinkers move preferentially towards a “pub” placed within the environment.  

The key components of the model are the rules that govern an agent’s change in drinking state. The never-drank state is given the symbol S. The current-drinker state is given the symbol D. The former-drinker state is  given the symbol R.  

The transition rules are: The S state can change to a D state. A D state can change to an R state and a R state can change to a D state.  

This means that a person who has never drunk (S) can become a drinker (D), but a drinker can never become a person who has never drunk. A drinker (D) can stop drinking and become a former drinker (R), but that person can start drinking again to become a drinker (D). 

The actual transition from one state to another is dependent on the state of the other agents in the same grid space and an intrinsic transition rate. For each space in the grid (the index i is used to identify the space) the total number of agents for each state is calculated (S(i), D(i), R(i))  

The probability of transitioning from never drinking (S) to drinking (D) is proportional to the fraction of drinkers among the other agents in the same grid space. The probability of transitioning from drinking (D) to being a former drinker (R) is proportional to the fraction of nondrinkers among the other agents in the same grid space plus an intrinsic rate (γ) The probability of transitioning from being a former drinker (R) to being a drinker (D) is proportional to the fraction of drinkers among the other agents in the same grid space plus an intrinsic rate (ρ). 

The experimenter can change the rate at which the agents move between grid spaces and the intrinsic rates of stopping drinking and resuming drinking. The experimenter can also introduce a space that preferentially attracts drinkers, a “pub”. 


## THINGS TO NOTICE
All agents will inevitably be either a drinker or a non-drinker and that the proportion of each is dependent on the intrinsic transition rates and that these are reflective of total societal processes such as health policies. The rate at which people change state is very dependent on the spatial nature of the environment. The rate of movement was a strong influence but that this was not linear with there being an “optimal” rate for transition. The inclusion of space that preferentially attracted drinkers also greatly influenced the transition rate again in a very nonlinear way. The model emphasized the complexity of drinking behavior but showed that elements could be deconstructed and used to better understand fundamental behavior.  


## THINGS TO TRY
There is an output area in the model this will capture the results from different runs.


<!-- 2022 -->
@#$#@#$#@
default
true
0
Polygon -7500403 true true 150 5 40 250 150 205 260 250

airplane
true
0
Polygon -7500403 true true 150 0 135 15 120 60 120 105 15 165 15 195 120 180 135 240 105 270 120 285 150 270 180 285 210 270 165 240 180 180 285 195 285 165 180 105 180 60 165 15

arrow
true
0
Polygon -7500403 true true 150 0 0 150 105 150 105 293 195 293 195 150 300 150

box
false
0
Polygon -7500403 true true 150 285 285 225 285 75 150 135
Polygon -7500403 true true 150 135 15 75 150 15 285 75
Polygon -7500403 true true 15 75 15 225 150 285 150 135
Line -16777216 false 150 285 150 135
Line -16777216 false 150 135 15 75
Line -16777216 false 150 135 285 75

bug
true
0
Circle -7500403 true true 96 182 108
Circle -7500403 true true 110 127 80
Circle -7500403 true true 110 75 80
Line -7500403 true 150 100 80 30
Line -7500403 true 150 100 220 30

butterfly
true
0
Polygon -7500403 true true 150 165 209 199 225 225 225 255 195 270 165 255 150 240
Polygon -7500403 true true 150 165 89 198 75 225 75 255 105 270 135 255 150 240
Polygon -7500403 true true 139 148 100 105 55 90 25 90 10 105 10 135 25 180 40 195 85 194 139 163
Polygon -7500403 true true 162 150 200 105 245 90 275 90 290 105 290 135 275 180 260 195 215 195 162 165
Polygon -16777216 true false 150 255 135 225 120 150 135 120 150 105 165 120 180 150 165 225
Circle -16777216 true false 135 90 30
Line -16777216 false 150 105 195 60
Line -16777216 false 150 105 105 60

car
false
0
Polygon -7500403 true true 300 180 279 164 261 144 240 135 226 132 213 106 203 84 185 63 159 50 135 50 75 60 0 150 0 165 0 225 300 225 300 180
Circle -16777216 true false 180 180 90
Circle -16777216 true false 30 180 90
Polygon -16777216 true false 162 80 132 78 134 135 209 135 194 105 189 96 180 89
Circle -7500403 true true 47 195 58
Circle -7500403 true true 195 195 58

circle
false
0
Circle -7500403 true true 0 0 300

circle 2
false
0
Circle -7500403 true true 0 0 300
Circle -16777216 true false 30 30 240

cow
false
0
Polygon -7500403 true true 200 193 197 249 179 249 177 196 166 187 140 189 93 191 78 179 72 211 49 209 48 181 37 149 25 120 25 89 45 72 103 84 179 75 198 76 252 64 272 81 293 103 285 121 255 121 242 118 224 167
Polygon -7500403 true true 73 210 86 251 62 249 48 208
Polygon -7500403 true true 25 114 16 195 9 204 23 213 25 200 39 123

cylinder
false
0
Circle -7500403 true true 0 0 300

dot
false
0
Circle -7500403 true true 90 90 120

face happy
false
0
Circle -7500403 true true 8 8 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Polygon -16777216 true false 150 255 90 239 62 213 47 191 67 179 90 203 109 218 150 225 192 218 210 203 227 181 251 194 236 217 212 240

face neutral
false
0
Circle -7500403 true true 8 7 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Rectangle -16777216 true false 60 195 240 225

face sad
false
0
Circle -7500403 true true 8 8 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Polygon -16777216 true false 150 168 90 184 62 210 47 232 67 244 90 220 109 205 150 198 192 205 210 220 227 242 251 229 236 206 212 183

fish
false
0
Polygon -1 true false 44 131 21 87 15 86 0 120 15 150 0 180 13 214 20 212 45 166
Polygon -1 true false 135 195 119 235 95 218 76 210 46 204 60 165
Polygon -1 true false 75 45 83 77 71 103 86 114 166 78 135 60
Polygon -7500403 true true 30 136 151 77 226 81 280 119 292 146 292 160 287 170 270 195 195 210 151 212 30 166
Circle -16777216 true false 215 106 30

flag
false
0
Rectangle -7500403 true true 60 15 75 300
Polygon -7500403 true true 90 150 270 90 90 30
Line -7500403 true 75 135 90 135
Line -7500403 true 75 45 90 45

flower
false
0
Polygon -10899396 true false 135 120 165 165 180 210 180 240 150 300 165 300 195 240 195 195 165 135
Circle -7500403 true true 85 132 38
Circle -7500403 true true 130 147 38
Circle -7500403 true true 192 85 38
Circle -7500403 true true 85 40 38
Circle -7500403 true true 177 40 38
Circle -7500403 true true 177 132 38
Circle -7500403 true true 70 85 38
Circle -7500403 true true 130 25 38
Circle -7500403 true true 96 51 108
Circle -16777216 true false 113 68 74
Polygon -10899396 true false 189 233 219 188 249 173 279 188 234 218
Polygon -10899396 true false 180 255 150 210 105 210 75 240 135 240

house
false
0
Rectangle -7500403 true true 45 120 255 285
Rectangle -16777216 true false 120 210 180 285
Polygon -7500403 true true 15 120 150 15 285 120
Line -16777216 false 30 120 270 120

leaf
false
0
Polygon -7500403 true true 150 210 135 195 120 210 60 210 30 195 60 180 60 165 15 135 30 120 15 105 40 104 45 90 60 90 90 105 105 120 120 120 105 60 120 60 135 30 150 15 165 30 180 60 195 60 180 120 195 120 210 105 240 90 255 90 263 104 285 105 270 120 285 135 240 165 240 180 270 195 240 210 180 210 165 195
Polygon -7500403 true true 135 195 135 240 120 255 105 255 105 285 135 285 165 240 165 195

line
true
0
Line -7500403 true 150 0 150 300

line half
true
0
Line -7500403 true 150 0 150 150

pentagon
false
0
Polygon -7500403 true true 150 15 15 120 60 285 240 285 285 120

person
false
0
Circle -7500403 true true 110 5 80
Polygon -7500403 true true 105 90 120 195 90 285 105 300 135 300 150 225 165 300 195 300 210 285 180 195 195 90
Rectangle -7500403 true true 127 79 172 94
Polygon -7500403 true true 195 90 240 150 225 180 165 105
Polygon -7500403 true true 105 90 60 150 75 180 135 105

plant
false
0
Rectangle -7500403 true true 135 90 165 300
Polygon -7500403 true true 135 255 90 210 45 195 75 255 135 285
Polygon -7500403 true true 165 255 210 210 255 195 225 255 165 285
Polygon -7500403 true true 135 180 90 135 45 120 75 180 135 210
Polygon -7500403 true true 165 180 165 210 225 180 255 120 210 135
Polygon -7500403 true true 135 105 90 60 45 45 75 105 135 135
Polygon -7500403 true true 165 105 165 135 225 105 255 45 210 60
Polygon -7500403 true true 135 90 120 45 150 15 180 45 165 90

square
false
0
Rectangle -7500403 true true 30 30 270 270

square 2
false
0
Rectangle -7500403 true true 30 30 270 270
Rectangle -16777216 true false 60 60 240 240

star
false
0
Polygon -7500403 true true 151 1 185 108 298 108 207 175 242 282 151 216 59 282 94 175 3 108 116 108

target
false
0
Circle -7500403 true true 0 0 300
Circle -16777216 true false 30 30 240
Circle -7500403 true true 60 60 180
Circle -16777216 true false 90 90 120
Circle -7500403 true true 120 120 60

tree
false
0
Circle -7500403 true true 118 3 94
Rectangle -6459832 true false 120 195 180 300
Circle -7500403 true true 65 21 108
Circle -7500403 true true 116 41 127
Circle -7500403 true true 45 90 120
Circle -7500403 true true 104 74 152

triangle
false
0
Polygon -7500403 true true 150 30 15 255 285 255

triangle 2
false
0
Polygon -7500403 true true 150 30 15 255 285 255
Polygon -16777216 true false 151 99 225 223 75 224

truck
false
0
Rectangle -7500403 true true 4 45 195 187
Polygon -7500403 true true 296 193 296 150 259 134 244 104 208 104 207 194
Rectangle -1 true false 195 60 195 105
Polygon -16777216 true false 238 112 252 141 219 141 218 112
Circle -16777216 true false 234 174 42
Rectangle -7500403 true true 181 185 214 194
Circle -16777216 true false 144 174 42
Circle -16777216 true false 24 174 42
Circle -7500403 false true 24 174 42
Circle -7500403 false true 144 174 42
Circle -7500403 false true 234 174 42

turtle
true
0
Polygon -10899396 true false 215 204 240 233 246 254 228 266 215 252 193 210
Polygon -10899396 true false 195 90 225 75 245 75 260 89 269 108 261 124 240 105 225 105 210 105
Polygon -10899396 true false 105 90 75 75 55 75 40 89 31 108 39 124 60 105 75 105 90 105
Polygon -10899396 true false 132 85 134 64 107 51 108 17 150 2 192 18 192 52 169 65 172 87
Polygon -10899396 true false 85 204 60 233 54 254 72 266 85 252 107 210
Polygon -7500403 true true 119 75 179 75 209 101 224 135 220 225 175 261 128 261 81 224 74 135 88 99

wheel
false
0
Circle -7500403 true true 3 3 294
Circle -16777216 true false 30 30 240
Line -7500403 true 150 285 150 15
Line -7500403 true 15 150 285 150
Circle -7500403 true true 120 120 60
Line -7500403 true 216 40 79 269
Line -7500403 true 40 84 269 221
Line -7500403 true 40 216 269 79
Line -7500403 true 84 40 221 269

x
false
0
Polygon -7500403 true true 270 75 225 30 30 225 75 270
Polygon -7500403 true true 30 75 75 30 270 225 225 270
@#$#@#$#@
NetLogo 6.2.2
@#$#@#$#@
setup
repeat 2500 [ walk1 ]
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
default
0.0
-0.2 0 0.0 1.0
0.0 1 1.0 0.0
0.2 0 0.0 1.0
link direction
true
0
Line -7500403 true 150 150 90 180
Line -7500403 true 150 150 210 180
@#$#@#$#@
1
@#$#@#$#@
