#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Activate conda environment
echo "Activating conda environment 'django-ai-project'..."

# Try different methods to activate the conda environment
# Method 1: If conda is initialized in the shell
if command -v conda &> /dev/null; then
    # Some systems need this to ensure conda commands work in scripts
    eval "$(conda shell.bash hook)"
    conda activate django-ai-project
# Method 2: Using source with conda.sh (common setup)
elif [ -f "$HOME/miniconda3/etc/profile.d/conda.sh" ]; then
    source "$HOME/miniconda3/etc/profile.d/conda.sh"
    conda activate django-ai-project
elif [ -f "$HOME/anaconda3/etc/profile.d/conda.sh" ]; then
    source "$HOME/anaconda3/etc/profile.d/conda.sh"
    conda activate django-ai-project
# Method 3: For older conda installations
else
    echo "Warning: Could not find conda. Trying to continue with current environment."
    # You might be already in the right environment if you're running this from an activated conda env
fi

# Run the tests with Django's test runner
echo "Running tests..."
python manage.py test api

# Print completion message
if [ $? -eq 0 ]; then
    echo "All tests completed successfully!"
else
    echo "Some tests failed. Please review the output above."
fi 