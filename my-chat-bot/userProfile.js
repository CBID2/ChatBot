class UserProfile {
    constructor(name, option, sector, country, timeZone) {
        this.name = name;
        this.option = option;
        this.sector = sector;
        this.country = country;
        this.timeZone = timeZone;
    }
}

module.exports.UserProfile = UserProfile;
