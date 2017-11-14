    /*
 * Copyright (c) 2017. Chris Myers
 */

    /**
     * Constructor for the projectile manager, this facilitates the creation and drawing of projectiles.
     * @param canvas A canvas to draw on.
     * @param drawInterval The interval at which to draw in milliseconds.
     * @constructor
     */
    function ProjectileManager(canvas, drawInterval) {
        this.context = canvas.getContext('2d');
        // trap a reference to the current object
        var self = this;
        setInterval(function() { self.reDraw(); }, drawInterval);
    }

    ProjectileManager.prototype = {
        constructor: ProjectileManager,
        projectiles: [],
        addProjectile: function(xStart, yStart) {
            this.projectiles.push(new Projectile(xStart, yStart));
        },
        reDraw: function() {
            // this function wipes and redraws the entire canvas
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.lineWidth = 1;
            // cycle through the projectiles and redraw them
            for(var i = 0 ; i < this.projectiles.length ; i++) {
                this.projectiles[i].reDraw(this.context);
            }
        }
    };

    /**
     * Constructor for the Projectile object, just requires an x and y start position and randomly generates its colour and velocities.
     * @param xStart
     * @param yStart
     * @constructor
     */
    function Projectile(xStart, yStart) {
        this.startPos = [xStart, yStart]; // we store start position as a vector [x, y]
        this.velocity = [5 + Math.random() * 10, 1 + Math.random() * 2]; // this is our random start velocity as a vector [x, y]
        switch(Math.floor(Math.random()*5 + 1)) { // generate a random colour
            case 1:
                this.color = 'blue';
                break;
            case 2:
                this.color = 'red';
                break;
            case 3:
                this.color = 'green';
                break;
            case 4:
                this.color = 'yellow';
                break;
            case 5:
                this.color = 'magenta';
                break;
            default:
                this.color = 'black';
                break;
        }
        this.startTime = Date.now();
    }

    Projectile.prototype = {
        constructor: Projectile,
        gravity: 1, // higher for more gravity
        bounce_friction: 1.3,// projectile horizontal velocity is divided by this each bounce
        bounce_factor: 0.6, // projectile vertical velocity is multiplied by this each bounce
        time_factor: 7, // affects the speed of time, do not change.
        reDraw: function(context) {
            var timeNow = (Date.now() - this.startTime)/1000;
            this.drawLine(context, timeNow);
        },
        getBounceVel: function(velocity) {
            // here we calculate the velocity loss effects of bouncing.
            return [velocity[0] / this.bounce_friction, -1 * velocity[1] * this.bounce_factor];
        },
        drawLine: function(context, timeNow) {
            // clone working copies of the start position and velocity to represent the current values.
            var pos = this.startPos.slice(0);
            var velocity = this.velocity.slice(0);
            context.strokeStyle = this.color;
            context.fillStyle = this.color;
            // first generate and draw the path
            context.beginPath();
            context.moveTo(pos[0], pos[1]);
            var time = 0;
            while(time < timeNow) {
                pos[0]++; // we draw one x value at a time
                var time_inc = 1 / (velocity[0] * this.time_factor);  // calculate the time increment for this x value
                time += time_inc; // increment time
                velocity[1] -= this.gravity * time_inc; // effect of gravity on velocity
                pos[1] -= velocity[1]; // set the new y value and draw
                context.lineTo(pos[0], pos[1]);
                if(pos[1] >= context.canvas.height - 4) { // bounce when projectile hits the bottom
                    if(pos[0] >= context.canvas.width || velocity[0] < 1) break; // once off screen or stopped we stop drawing
                    velocity = this.getBounceVel(velocity);
                    pos[1] = context.canvas.height - 4; // correct bounce point if it would fall off the bottom of the screen
                }
                if(velocity[0] === 0) break; // stop drawing when projectile stops

            }
            context.stroke();
            // now draw the projectile
            context.beginPath();
            context.arc(pos[0], pos[1], 4, 0, 2*Math.PI);
            context.fill();
        }
    };

    (function () {
        var canvas = document.getElementById('canvas');// get our canvas element
        setCanvasSize(canvas); // fill to entire window

        var projectile_manager = new ProjectileManager(canvas, 40);

        // every time the canvas is clicked we spawn a projectile
        canvas.addEventListener("click", function (e) {
            projectile_manager.addProjectile(e.x, e.y);
        });

        // if the window is resized we should catch this and adjust the canvas.
        window.addEventListener('resize', function () {
            setCanvasSize(canvas);
            projectile_manager.reDraw();
        });

        /**
         * Stretch the canvas to fill the window.
         * @param canvas
         */
        function setCanvasSize(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    })();

