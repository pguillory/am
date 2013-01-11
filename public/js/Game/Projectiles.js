function Projectiles(terrain) {
  var self = {}
  
  var projectiles = []
  
  self.create = function(position, velocity) {
    var projectile = new Projectile(position, velocity)
    projectiles.push(projectile)
    return projectile
  }
  
  self.increment = function() {
    projectiles.forEach(function(projectile) {
      projectile.lastPosition = projectile.position
      projectile.position = projectile.position.plus(projectile.velocity).round()
      projectile.velocity.y += 1

      var material = terrain.get(projectile.position.x, projectile.position.y)
      if (material != AIR) {
        projectile.kill()
      }
    })

    projectiles = projectiles.filter(function(projectile) {
      return projectile.alive()
    })
  }

  self.forEach = function(callback) {
    projectiles.forEach(callback)
  }

  return self
}
