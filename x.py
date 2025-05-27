def plot_course_credit_matrix(df_all_courses):
    plt.figure(figsize=(14, 10))
    
    # Define grade quality categories for coloring
    def grade_quality(grade_letter):
        if grade_letter in ['A+', 'A', 'A-']: return 'Excellent (A)'
        if grade_letter in ['B+', 'B', 'B-']: return 'Good (B)'
        if grade_letter in ['C+', 'C', 'C-']: return 'Satisfactory (C)'
        if grade_letter in ['D+', 'D']: return 'Pass (D)'
        if grade_letter == 'F': return 'Fail (F)'
        if grade_letter == 'CR': return 'Credit (CR)'
        if grade_letter == 'W': return 'Withdrawal (W)'
        return 'Other'

    df_all_courses['Grade_Quality'] = df_all_courses['Grade_Letter'].apply(grade_quality)
    
    quality_colors = {
        'Excellent (A)': 'lime',
        'Good (B)': 'deepskyblue',
        'Satisfactory (C)': 'gold',
        'Pass (D)': 'orange',
        'Fail (F)': 'red',
        'Credit (CR)': 'mediumpurple',
        'Withdrawal (W)': 'dimgray',
        'Other': 'lightgray'
    }
    
    # Jitter for better visibility of overlapping points (especially for 3.0 unit courses)
    jitter_strength = 0.1
    df_all_courses['Units_Taken_Jittered'] = df_all_courses['Units_Taken'] + np.random.uniform(-jitter_strength, jitter_strength, size=len(df_all_courses))
    df_all_courses['Units_Passed_Jittered'] = df_all_courses['Units_Passed'] + np.random.uniform(-jitter_strength, jitter_strength, size=len(df_all_courses))

    # Size by total grade points (0 for CR/W makes them small)
    # Add a minimum size so CR/W are still visible
    sizes = df_all_courses['Total_Grade_Points'].fillna(0) * 10 + 50

    sns.scatterplot(
        data=df_all_courses,
        x='Units_Taken_Jittered',
        y='Units_Passed_Jittered',
        hue='Grade_Quality',
        size=sizes, # Use the calculated sizes array
        palette=quality_colors,
        alpha=0.7,
        edgecolor='black',
        linewidth=0.5,
        legend='full', # Show size in legend if possible, though direct mapping is tricky with scatterplot sizes
        sizes=(50, 500) # Define range for legend if 'sizes' was a categorical variable
    )
    
    # Line for Units Taken = Units Passed
    max_units = max(df_all_courses['Units_Taken'].max(), df_all_courses['Units_Passed'].max())
    plt.plot([0, max_units + 0.5], [0, max_units + 0.5], 'k--', alpha=0.5, label='Units Taken = Units Passed')

    plt.xlabel("Units Attempted (Jittered)", fontsize=14)
    plt.ylabel("Units Successfully Passed (Jittered)", fontsize=14)
    plt.title("Course Credit Matrix: Attempted vs. Passed Units", fontsize=18, pad=20)
    
    plt.xticks(np.arange(0, max_units + 1, 0.5))
    plt.yticks(np.arange(0, max_units + 1, 0.5))
    plt.xlim(-0.5, max_units + 0.5)
    plt.ylim(-0.5, max_units + 0.5)
    
    plt.grid(True, linestyle=':', alpha=0.6)
    plt.legend(title='Grade Quality / Outcome', bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout(rect=[0, 0, 0.8, 1]) # Adjust for legend outside
    plt.show()

plot_course_credit_matrix(df_courses)