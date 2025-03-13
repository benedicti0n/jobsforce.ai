export const generateAvatarData = (company) => {
    const colors = [
        "#F97316",
        "#10B981",
        "#3B82F6",
        "#8B5CF6",
        "#EC4899",
        "#F43F5E",
        "#0891B2",
        "#84CC16",
    ];

    const colorIndex = Math.floor(company.length % colors.length);
    const logoColor = colors[colorIndex];

    // Generate initials from company name
    const words = company.split(" ");
    let initials = "";

    if (words.length >= 2) {
        initials = words[0][0] + words[1][0];
    } else if (words[0].length >= 2) {
        initials = words[0].substring(0, 2);
    } else {
        initials = words[0][0];
    }

    return { logoColor, initials: initials.toUpperCase() };
};

export const generateCompanyAvatar = (companyName) => {
    const colors = [
        "#4f46e5",
        "#0ea5e9",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
    ];

    const initials = companyName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    const colorIndex = companyName.length % colors.length;

    return {
        logo: initials,
        logoColor: colors[colorIndex],
    };
};