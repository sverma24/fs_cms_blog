

export function generateSlug(text: string, unique: boolean = false) {
    let slug = text.toLowerCase().replace(' ','-')
    
    if(unique) {
        let uniqueNumber = Math.floor(Math.random() * 1000);
        slug = slug + '-' + uniqueNumber;
    }

    
    return slug
}