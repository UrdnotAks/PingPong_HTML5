# PingPong_HTML5
A simple pingpong game using HTML and TypeScript

# Outline of this project
The level of difficulty changes dynamically to match the player's playstyle. If the computer scores two points consecutively, the computer reduces its speed to give the player a chance to score. And if the player scores two points consecutively, the computer increases its speed and puts up a good fight. There is a set of five speed values the computer can move with, which is dynamically chosen on runtime.

# BUGS
There is still a couple of bugs needed to be fixed.

1. The Button UI is not fine tuned and the player has to press the center of the button to get it to work.
2. When the ball moves along the edge of the window, it won't bounce off like you'd expect and just attaches itself to the boundary line which makes the ball bounce off the player and computer's paddle indefinitely. The WORKAROUND for this is the player has to lose a point, which resets the position of the ball.
