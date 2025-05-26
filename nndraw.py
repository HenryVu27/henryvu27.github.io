import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_attention_block():
    fig, ax = plt.subplots(1, 1, figsize=(10, 6))

    # Hide axes
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')

    # --- Draw the Self-Attention Blocks (Simplified) ---
    block_width = 1.5
    block_height = 0.8
    spacing_x = 0.5
    spacing_y = 0.5

    # Q, K, V (using simple rectangles for demonstration)
    q_pos = (2, 4.5)
    k_pos = (2, 3)
    v_pos = (2, 1.5)

    q_box = patches.Rectangle(q_pos, block_width, block_height, linewidth=1, edgecolor='black', facecolor='#d9f0d3')
    k_box = patches.Rectangle(k_pos, block_width, block_height, linewidth=1, edgecolor='black', facecolor='#d9f0d3')
    v_box = patches.Rectangle(v_pos, block_width, block_height, linewidth=1, edgecolor='black', facecolor='#d9f0d3')

    ax.add_patch(q_box)
    ax.add_patch(k_box)
    ax.add_patch(v_box)

    ax.text(q_pos[0] + block_width / 2, q_pos[1] + block_height / 2, 'Q', ha='center', va='center', fontsize=12)
    ax.text(k_pos[0] + block_width / 2, k_pos[1] + block_height / 2, 'K', ha='center', va='center', fontsize=12)
    ax.text(v_pos[0] + block_width / 2, v_pos[1] + block_height / 2, 'V', ha='center', va='center', fontsize=12)

    # Dot Product (Q, K)
    dot_product1_pos = (q_pos[0] + block_width + spacing_x, (q_pos[1] + k_pos[1] + block_height) / 2 - block_height/2)
    dot_product1_box = patches.Rectangle(dot_product1_pos, block_width * 0.7, block_height * 2.5, linewidth=1, edgecolor='black', facecolor='#d9f0d3')
    ax.add_patch(dot_product1_box)
    ax.text(dot_product1_pos[0] + block_width * 0.7 / 2, dot_product1_pos[1] + 2.5*block_height/2, 'Dot\nProduct', ha='center', va='center', fontsize=10)

    # Scaling
    scaling_pos = (dot_product1_pos[0] + block_width * 0.7 + spacing_x, dot_product1_pos[1] + block_height)
    scaling_box = patches.Rectangle(scaling_pos, block_width, block_height, linewidth=1, edgecolor='black', facecolor='#d9f0d3')
    ax.add_patch(scaling_box)
    ax.text(scaling_pos[0] + block_width / 2, scaling_pos[1] + block_height / 2, 'Scaling', ha='center', va='center', fontsize=10)

    # Softmax
    softmax_pos = (scaling_pos[0] + block_width + spacing_x, scaling_pos[1])
    softmax_box = patches.Rectangle(softmax_pos, block_width, block_height, linewidth=1, edgecolor='black', facecolor='#d9f0d3')
    ax.add_patch(softmax_box)
    ax.text(softmax_pos[0] + block_width / 2, softmax_pos[1] + block_height / 2, 'Softmax', ha='center', va='center', fontsize=10)

    # Dot Product (Softmax, V)
    dot_product2_pos = (softmax_pos[0] + block_width + spacing_x, (softmax_pos[1] + v_pos[1] + block_height)/2 - block_height/2 )
    dot_product2_box = patches.Rectangle(dot_product2_pos, block_width * 0.7, block_height * 2.5, linewidth=1, edgecolor='black', facecolor='#d9f0d3')
    ax.add_patch(dot_product2_box)
    ax.text(dot_product2_pos[0] + block_width * 0.7 / 2, dot_product2_pos[1] + 2.5*block_height/2, 'Dot\nProduct', ha='center', va='center', fontsize=10)

    # Feed-Forward
    feed_forward_pos = (dot_product2_pos[0] + block_width * 0.7 + spacing_x, dot_product2_pos[1] + block_height)
    feed_forward_box = patches.Rectangle(feed_forward_pos, block_width, block_height * 2.5, linewidth=1, edgecolor='black', facecolor='#d9f0d3')
    ax.add_patch(feed_forward_box)
    ax.text(feed_forward_pos[0] + block_width / 2, feed_forward_pos[1] + 2.5*block_height/2, 'Feed-Forward', ha='center', va='center', fontsize=10, rotation=90)


    # --- Draw Arrows ---

    # Linear Input (Placeholder - needs to come from the left)
    linear_input_x = 0.5
    linear_input_y = k_pos[1] + block_height/2 # Center vertically with K approximately
    ax.annotate('', xy=(q_pos[0], q_pos[1] + block_height/2), xytext=(linear_input_x, linear_input_y),
                arrowprops=dict(arrowstyle='->', lw=1))
    ax.annotate('', xy=(k_pos[0], k_pos[1] + block_height/2), xytext=(linear_input_x, linear_input_y),
                arrowprops=dict(arrowstyle='->', lw=1))
    ax.annotate('', xy=(v_pos[0], v_pos[1] + block_height/2), xytext=(linear_input_x, linear_input_y),
                arrowprops=dict(arrowstyle='->', lw=1))
    ax.text(linear_input_x, linear_input_y + 0.3, 'Linear', ha='center', va='bottom', fontsize=10)

    # Q, K to Dot Product 1
    ax.annotate('', xy=(dot_product1_pos[0], q_pos[1] + block_height/2),
                xytext=(q_pos[0] + block_width, q_pos[1] + block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))
    ax.annotate('', xy=(dot_product1_pos[0], k_pos[1] + block_height/2),
                xytext=(k_pos[0] + block_width, k_pos[1] + block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))

    # Dot Product 1 to Scaling
    ax.annotate('', xy=(scaling_pos[0], scaling_pos[1] + block_height/2),
                xytext=(dot_product1_pos[0] + block_width * 0.7, scaling_pos[1] + block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))

    # Scaling to Softmax
    ax.annotate('', xy=(softmax_pos[0], softmax_pos[1] + block_height/2),
                xytext=(scaling_pos[0] + block_width, scaling_pos[1] + block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))

    # Softmax and V to Dot Product 2
    # Softmax -> Dot Product 2 (need to adjust vertical alignment)
    ax.annotate('', xy=(dot_product2_pos[0], softmax_pos[1] + block_height/2),
                xytext=(softmax_pos[0] + block_width, softmax_pos[1] + block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))

    # V -> Dot Product 2
    ax.annotate('', xy=(dot_product2_pos[0], v_pos[1] + block_height/2),
                xytext=(v_pos[0] + block_width, v_pos[1] + block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))


    # Dot Product 2 to Feed-Forward
    ax.annotate('', xy=(feed_forward_pos[0], dot_product2_pos[1] + 2.5*block_height/2),
                xytext=(dot_product2_pos[0] + block_width * 0.7, dot_product2_pos[1] + 2.5*block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))

    # Output arrow from Feed-Forward
    ax.annotate('', xy=(feed_forward_pos[0] + block_width + spacing_x, feed_forward_pos[1] + 2.5*block_height/2),
                xytext=(feed_forward_pos[0] + block_width, feed_forward_pos[1] + 2.5*block_height/2),
                arrowprops=dict(arrowstyle='->', lw=1))


    # Add titles
    ax.text(5, 5.8, r'N $\times$ Self-Attention', ha='center', va='top', fontsize=14)
    # Add the (m, k) dimension label near K (approximate position)
    ax.text(k_pos[0] + block_width/2, k_pos[1] - 0.3, r'(m, k)', ha='center', va='top', fontsize=10)


    plt.tight_layout()
    plt.show()
    # plt.savefig('attention_block.svg', format='svg') # Uncomment to save


# Run the function to display the plot
draw_attention_block()