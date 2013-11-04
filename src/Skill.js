"use strict";

/**
 * Skill Class
 * Abstract class to represent a skill
 * owned by a PlayableEntity instance
 * Subclasses should implement fire(target:NanoEntity)
 */
var Skill = function(_range, _damage, _owner, _maxCooldown) {
	if (_range == undefined)
		return;//this may be called by prototype inheritance
	// Public fields
	this.range; // Effective range of the skill
	this.damage; // Total damage of the skill
	this.owner; // A reference to the PlayableEntity that owns this skill
	this.cooldown;//milliseconds need to wait before continue firing again
	this.maxCooldown;
	
	this.range = _range;
	this.damage = _damage;	
	this.owner = _owner;
	this.maxCooldown = _maxCooldown;
	this.cooldown = 0;
}

// getters
Skill.prototype.getRange = function() {
	return this.range;
}

Skill.prototype.getDamage = function() {
	return this.damage;
}

Skill.prototype.getCooldown = function() {
	return this.cooldown;
}

Skill.prototype.getMaxCooldown = function(){
	return this.maxCooldown;
}

Skill.prototype.update = function(elapsedTime) {
	if (this.cooldown > 0)
	{
		this.cooldown -= elapsedTime;
		if (this.cooldown == 0)
			this.cooldown = 0;
	}
}

/**
 * @param target A NanoEntity target to fire at
*/
Skill.prototype.fire = function(target) {
	if (this.cooldown > 0)
		return;
		
	this._fireForReal(target);//sub class's specific implementation 
	
	this.cooldown += this.maxCooldown;//make the skill unable to be used again until <cooldown> time later
}

/**
 * AcidWeapon Class
 * A skill used by WarriorCell
 */
var AcidWeapon = function ( _owner) {
	if (_owner == undefined)
		return;
	// public fields
	this.effectDuration; // Duration of the damaging effect
	
	// calls superclass constructor
	Skill.call(this, Constant.SKILL_RANGE_LONG, 30, _owner, 700);//0.7s cooldown
	
	this.effectDuration = 3000;//3s
}

//inheritance from Skill
AcidWeapon.prototype = new Skill();
AcidWeapon.prototype.constructor = AcidWeapon;

AcidWeapon.prototype.getEffectDuration = function() {
	return this.effectDuration;
}

/**
 * Implements Skill._fireForReal(target)
 * creates an Acid that chases the target
 * @param target A NanoEntity to fire at
 */
AcidWeapon.prototype._fireForReal = function(target) {
	var ownerPos = this.owner.getPosition();
	//shoot the acid projectile starting from the skill owner's position
	var acid = new Acid(this, target, ownerPos.x, ownerPos.y);
}

/**
 * LifeLeech Class
 * A skill used by LeechVirus
 */
var LifeLeech = function (_owner) {
	if (_owner == undefined)
		return;
		
	// calls superclass constructor
	Skill.call(this, Constant.SKILL_RANGE_MED, 20, _owner, 1000);//1s cooldown
	
}


//inheritance from Skill
LifeLeech.prototype = new Skill();
LifeLeech.prototype.constructor = LifeLeech;

	
/**
 * Implements Skill._fireForReal(target)
 * reduces HP from the target
 * and increases the same amount of HP
 * for the skill caster
 * @param target A NanoEntity to fire at
 */
LifeLeech.prototype._fireForReal = function(target) {
	var effect = new LifeLeechEffect(this.owner, this.damage);
	target.addEffect(effect);
}


// For node.js require
if (typeof global != 'undefined')
{
	global.Skill = Skill;
	global.AcidWeapon = AcidWeapon;
	global.LifeLeech = LifeLeech;
}